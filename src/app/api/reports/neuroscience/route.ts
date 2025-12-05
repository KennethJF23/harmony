import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

// Neuroscience report: aggregates survey responses and session data.
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectToDatabase();

    // Time range optional (default 30d)
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '30d';
    const now = Date.now();
    const ranges: Record<string, number> = { '24h': 86400000, '7d': 604800000, '30d': 2592000000, '90d': 7776000000 };
    const startTime = new Date(now - (ranges[timeRange] || ranges['30d']));

    // Fetch sessions: in-range for charts; all-time for overview totals
    const sessions = await db.collection('sessions')
      .find({ timestamp: { $gte: startTime.getTime() } })
      .toArray();
    const allSessions = await db.collection('sessions')
      .find({})
      .toArray();

    const responses = await db.collection('survey_responses')
      .find({ createdAt: { $gte: startTime } })
      .toArray();

    // Listening time per user and overall (all-time)
    const userListening: Record<string, number> = {};
    let totalListeningMinutes = 0;
    allSessions.forEach((s: any) => {
      const dur = s.duration || 0;
      // Handle duration unit safely: seconds vs milliseconds
      // If duration looks like milliseconds (> 100000 ms ~ 1.6 min), convert using /60000
      // Otherwise assume seconds and convert using /60
      const minutes = dur >= 100000 ? dur / 60000 : dur / 60;
      totalListeningMinutes += minutes;
      const uid = (s.userId?.toString()) || 'unknown';
      userListening[uid] = (userListening[uid] || 0) + minutes;
    });

    const totalUsers = Object.keys(userListening).length;
    const avgListeningPerUser = totalUsers > 0 ? Math.round((totalListeningMinutes / totalUsers) * 10) / 10 : 0;

    // Feedback aggregation
    const feedbackByQuestion: Record<string, Record<string, number>> = {};
    const categoryCounts: Record<string, number> = {};
    responses.forEach((r: any) => {
      const q = r.question;
      const ans = String(r.answer || 'Unknown');
      feedbackByQuestion[q] = feedbackByQuestion[q] || {};
      feedbackByQuestion[q][ans] = (feedbackByQuestion[q][ans] || 0) + 1;
      const cat = r.category || 'other';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const questionSummaries = Object.entries(feedbackByQuestion).map(([question, answers]) => {
      const total = Object.values(answers).reduce((sum, c) => sum + c, 0);
      const sorted = Object.entries(answers).sort((a, b) => b[1] - a[1]);
      const top = sorted[0] || ['N/A', 0];
      return { question, totalResponses: total, topAnswer: { answer: top[0], count: top[1] } };
    }).sort((a, b) => b.totalResponses - a.totalResponses).slice(0, 10);

    const categoryBreakdown = Object.entries(categoryCounts).map(([category, count]) => ({ category, count }));

    // XGBoost placeholder: score engagement likelihood based on listening time and positive feedback ratio
    // In production, call a Python microservice that runs XGBoost and returns feature importance & scores.
    const positiveSet = ['yes', 'synchronizing', 'harmonized', 'calming', 'balanced', 'smoother'];
    let positiveCount = 0;
    let totalResp = responses.length;
    responses.forEach((r: any) => {
      const ans = String(r.answer || '').toLowerCase();
      if (positiveSet.some(p => ans.includes(p))) positiveCount++;
    });
    const positiveRate = totalResp > 0 ? Math.round((positiveCount / totalResp) * 100) : 0;

    const heuristicEngagementScore = Math.min(100, Math.round((avgListeningPerUser * 2) + (positiveRate * 0.6)));

    const report = {
      period: timeRange,
      totals: {
        sessions: allSessions.length,
        totalListeningMinutes: Math.round(totalListeningMinutes),
        users: totalUsers,
        avgListeningPerUser,
        surveyResponses: totalResp,
        positiveRate,
      },
      feedback: {
        topQuestions: questionSummaries,
        categories: categoryBreakdown,
      },
      ml: {
        model: 'xgboost',
        status: 'heuristic-fallback',
        engagementScore: heuristicEngagementScore,
        notes: 'Replace with Python XGBoost service for production scoring.'
      }
    };

    return NextResponse.json(report);
  } catch (err) {
    console.error('Neuroscience report error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Generate an AI-style neuroscience analysis report on demand.
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const token = authHeader.replace('Bearer ', '');
    const currentUser = await db.collection('users').findOne({ sessionToken: token });

    // Optional payload may include a specific userId to analyze
    const body = await request.json().catch(() => ({}));
    const { userId, timeRange = '30d' } = body || {};

    const now = Date.now();
    const ranges: Record<string, number> = { '24h': 86400000, '7d': 604800000, '30d': 2592000000, '90d': 7776000000 };
    const startTime = now - (ranges[timeRange] || ranges['30d']);

    const sessionQuery: any = { timestamp: { $gte: startTime } };
    // Scope analysis: users analyze self; neuroscientists analyze all unless userId is provided
    if (userId) sessionQuery.userId = userId;
    else if (currentUser && currentUser.role !== 'neuroscientist') sessionQuery.userId = currentUser._id;

    const sessions = await db.collection('sessions').find(sessionQuery).toArray();
    const responses = await db.collection('survey_responses')
      .find({ createdAt: { $gte: new Date(startTime) } })
      .toArray();

    // All-time sessions for totals (per user if available)
    const allTimeQuery: any = {};
    if (sessionQuery.userId) allTimeQuery.userId = sessionQuery.userId;
    const allSessions = await db.collection('sessions').find(allTimeQuery).toArray();

    // Feature extraction
    const totalsMinutes = allSessions.reduce((sum: number, s: any) => sum + ((s.duration || 0) >= 100000 ? (s.duration / 60000) : (s.duration || 0) / 60), 0);
    const distinctUsers = new Set(allSessions.map((s: any) => (s.userId ? String(s.userId) : 'unknown'))).size;
    const totals = {
      sessions: allSessions.length,
      totalListeningMinutes: Math.round(totalsMinutes),
      users: distinctUsers,
      avgListeningPerUser: distinctUsers > 0 ? Math.round((totalsMinutes / distinctUsers) * 10) / 10 : 0,
      positiveRate: 0, // placeholder; set below
    };

    const byGoal: Record<string, { count: number; minutes: number }> = {};
    const byFreq: Record<string, { count: number; minutes: number }> = {};
    sessions.forEach((s: any) => {
      const goal = s.goal || 'focus';
      const freq = (s.frequency || '').toLowerCase();
      byGoal[goal] = byGoal[goal] || { count: 0, minutes: 0 };
      byGoal[goal].count++;
      const mins = (s.duration || 0) >= 100000 ? s.duration / 60000 : (s.duration || 0) / 60;
      byGoal[goal].minutes += mins;
      const band = freq.includes('alpha') ? 'Alpha' : freq.includes('theta') ? 'Theta' : freq.includes('beta') ? 'Beta' : freq.includes('delta') ? 'Delta' : 'Unknown';
      byFreq[band] = byFreq[band] || { count: 0, minutes: 0 };
      byFreq[band].count++;
      byFreq[band].minutes += mins;
    });

    // Simple AI-style scoring based on minutes distribution and positive survey ratio
    const positiveSet = ['yes', 'synchronizing', 'harmonized', 'calming', 'balanced', 'smoother'];
    let positiveCount = 0;
    responses.forEach((r: any) => {
      const ans = String(r.answer || '').toLowerCase();
      if (positiveSet.some(p => ans.includes(p))) positiveCount++;
    });
    const positiveRate = responses.length > 0 ? Math.round((positiveCount / responses.length) * 100) : 0;
    totals.positiveRate = positiveRate;

    const goalWeights: Record<string, number> = { focus: 1.2, relaxation: 1.0, sleep: 0.8, creativity: 1.1 };
    const goalScore = Object.entries(byGoal).reduce((score, [g, v]) => score + (v.minutes * (goalWeights[g] || 1)), 0);
    const freqWeights: Record<string, number> = { Alpha: 1.2, Theta: 1.1, Beta: 1.0, Delta: 0.9 };
    const freqScore = Object.entries(byFreq).reduce((score, [f, v]) => score + (v.minutes * (freqWeights[f] || 0.8)), 0);

    const engagementScore = Math.min(100, Math.round((goalScore + freqScore) / 10 + positiveRate * 0.5));

    const recommendations = [] as Array<{ title: string; detail: string }>;
    if ((byFreq['Alpha']?.minutes || 0) < 30) {
      recommendations.push({ title: 'Increase Alpha exposure', detail: 'Add 20–30 min of Alpha tracks (8–12 Hz) for focus/relaxation balance.' });
    }
    if ((byGoal['sleep']?.minutes || 0) > 60 && positiveRate < 50) {
      recommendations.push({ title: 'Adjust sleep protocol', detail: 'Try Delta (0.5–4 Hz) before bed with reduced volume; consider shorter sessions.' });
    }
    if ((byGoal['focus']?.minutes || 0) > 120) {
      recommendations.push({ title: 'Structured breaks', detail: 'Use 25/5 Pomodoro cycles to prevent cognitive fatigue during extended focus.' });
    }

    const analysis = {
      period: timeRange,
      totals,
      distribution: {
        byGoal: Object.entries(byGoal).map(([g, v]) => ({ goal: g, minutes: Math.round(v.minutes), sessions: v.count })),
        byFrequency: Object.entries(byFreq).map(([f, v]) => ({ band: f, minutes: Math.round(v.minutes), sessions: v.count })),
      },
      ai: {
        model: 'neuro-heuristics',
        engagementScore,
        recommendations,
      },
    };

    return NextResponse.json(analysis, { status: 200 });
  } catch (err) {
    console.error('Neuroscience analysis error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
