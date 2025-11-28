import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    // Mock data for development
    if (process.env.NODE_ENV === 'development' || token.startsWith('mock-token')) {
      return NextResponse.json(getMockDashboardData());
    }
    
    const { db } = await connectToDatabase();
    
    // Get user data
    const user = await db.collection('users').findOne({ 
      // Replace with actual token verification
      // _id: new ObjectId(userIdFromToken)
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get user sessions
    const sessions = await db.collection('sessions')
      .find({ userId: user._id })
      .sort({ timestamp: -1 })
      .limit(10)
      .toArray();

    // Calculate total hours
    const totalMinutes = sessions.reduce((acc, session) => acc + (session.duration / 60), 0);
    const totalHours = totalMinutes / 60;

    // Get completed sessions count
    const sessionsCompleted = sessions.filter(s => s.completed).length;

    // Calculate current streak
    const currentStreak = calculateStreak(sessions);

    // Get wave frequency statistics
    const waveFrequency = calculateWaveFrequency(sessions);

    // Get favorite wave
    const favoriteWave = waveFrequency.length > 0 
      ? `${waveFrequency[0].name} (${getFrequencyRange(waveFrequency[0].name)})`
      : 'Alpha (8-12 Hz)';

    // Get weekly progress
    const weeklyProgress = calculateWeeklyProgress(sessions);

    // Get recent sessions
    const recentSessions = sessions.slice(0, 5).map(session => ({
      id: session._id.toString(),
      track: session.trackName,
      duration: Math.round(session.duration / 60),
      category: session.category || 'focus',
      timestamp: session.timestamp,
      completed: session.completed,
    }));

    // Get mood ratings (if available)
    const moodRatings = await db.collection('moods')
      .find({ userId: user._id })
      .sort({ date: -1 })
      .limit(7)
      .toArray();

    return NextResponse.json({
      userName: user.name || user.email?.split('@')[0] || 'User',
      totalHours: Number(totalHours.toFixed(1)),
      sessionsCompleted,
      currentStreak,
      favoriteWave,
      recentSessions,
      waveFrequency,
      weeklyProgress,
      moodRatings: moodRatings.map(m => ({
        date: m.date,
        rating: m.rating,
        category: m.category,
      })),
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function calculateStreak(sessions: any[]): number {
  if (sessions.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let streak = 0;
  let currentDate = new Date(today);

  // Sort sessions by date descending
  const sortedSessions = sessions
    .map(s => new Date(s.timestamp))
    .sort((a, b) => b.getTime() - a.getTime());

  for (const sessionDate of sortedSessions) {
    const sessionDay = new Date(sessionDate);
    sessionDay.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((currentDate.getTime() - sessionDay.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0 || diffDays === 1) {
      if (sessionDay.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (diffDays === 1) {
        streak++;
        currentDate = sessionDay;
        currentDate.setDate(currentDate.getDate() - 1);
      }
    } else {
      break;
    }
  }

  return streak;
}

function calculateWaveFrequency(sessions: any[]) {
  const frequency: Record<string, number> = {
    Alpha: 0,
    Theta: 0,
    Beta: 0,
    Delta: 0,
  };

  sessions.forEach(session => {
    const trackName = session.trackName?.toLowerCase() || '';
    if (trackName.includes('alpha')) frequency.Alpha++;
    else if (trackName.includes('theta')) frequency.Theta++;
    else if (trackName.includes('beta')) frequency.Beta++;
    else if (trackName.includes('delta')) frequency.Delta++;
  });

  const total = Object.values(frequency).reduce((a, b) => a + b, 0);
  
  return Object.entries(frequency)
    .map(([name, count]) => ({
      name,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .filter(item => item.count > 0)
    .sort((a, b) => b.count - a.count);
}

function calculateWeeklyProgress(sessions: any[]) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const weekProgress: { day: string; hours: number }[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const daysSessions = sessions.filter(s => {
      const sessionDate = new Date(s.timestamp);
      return sessionDate >= date && sessionDate < nextDate;
    });

    const totalMinutes = daysSessions.reduce((acc, s) => acc + (s.duration / 60), 0);
    
    weekProgress.push({
      day: days[date.getDay()],
      hours: Number((totalMinutes / 60).toFixed(1)),
    });
  }

  return weekProgress;
}

function getFrequencyRange(waveName: string): string {
  const ranges: Record<string, string> = {
    Alpha: '8-12 Hz',
    Theta: '4-8 Hz',
    Beta: '13-30 Hz',
    Delta: '0.5-4 Hz',
  };
  return ranges[waveName] || '';
}

function getMockDashboardData() {
  return {
    userName: 'Demo User',
    totalHours: 24.5,
    sessionsCompleted: 42,
    currentStreak: 7,
    favoriteWave: 'Alpha (8-12 Hz)',
    recentSessions: [
      {
        id: '1',
        track: 'Deep Focus Alpha',
        duration: 25,
        category: 'focus',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        completed: true,
      },
      {
        id: '2',
        track: 'Theta Meditation',
        duration: 30,
        category: 'relaxation',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        completed: true,
      },
      {
        id: '3',
        track: 'Creative Flow Beta',
        duration: 45,
        category: 'creativity',
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        completed: false,
      },
    ],
    waveFrequency: [
      { name: 'Alpha', count: 18, percentage: 43 },
      { name: 'Theta', count: 12, percentage: 29 },
      { name: 'Beta', count: 8, percentage: 19 },
      { name: 'Delta', count: 4, percentage: 9 },
    ],
    weeklyProgress: [
      { day: 'Mon', hours: 2.5 },
      { day: 'Tue', hours: 3.2 },
      { day: 'Wed', hours: 4.1 },
      { day: 'Thu', hours: 2.8 },
      { day: 'Fri', hours: 3.5 },
      { day: 'Sat', hours: 4.8 },
      { day: 'Sun', hours: 3.6 },
    ],
    moodRatings: [
      { date: '2024-01-01', rating: 4, category: 'focus' },
      { date: '2024-01-02', rating: 5, category: 'relaxation' },
      { date: '2024-01-03', rating: 3, category: 'creativity' },
    ],
  };
}
