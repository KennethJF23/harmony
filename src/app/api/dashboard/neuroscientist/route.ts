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
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '7d';
    
    try {
      const { db } = await connectToDatabase();
      console.log('Connected to database for neuroscientist dashboard');
      
      // Calculate time range
      const now = Date.now();
      const timeRanges: Record<string, number> = {
        '24h': 86400000,
        '7d': 604800000,
        '30d': 2592000000,
        '90d': 7776000000,
      };
      const startTime = now - (timeRanges[timeRange] || timeRanges['7d']);
      
      // Get all users
      const users = await db.collection('users').find({ role: 'user' }).toArray();
      const totalUsers = users.length;
      
      // Get all sessions within time range
      const allSessions = await db.collection('sessions')
        .find({ timestamp: { $gte: startTime } })
        .toArray();
      
      // Calculate active users (users with sessions in time range)
      const activeUserIds = new Set(allSessions.map(s => s.userId?.toString()));
      const activeUsers = activeUserIds.size;
      
      // Calculate total sessions and average duration
      const totalSessions = allSessions.length;
      const avgSessionDuration = allSessions.length > 0
        ? Math.round(allSessions.reduce((sum, s) => sum + (s.duration / 60), 0) / allSessions.length)
        : 0;
      
      // Calculate frequency usage
      const frequencyCount: Record<string, { count: number; totalDuration: number }> = {
        'Alpha': { count: 0, totalDuration: 0 },
        'Theta': { count: 0, totalDuration: 0 },
        'Beta': { count: 0, totalDuration: 0 },
        'Delta': { count: 0, totalDuration: 0 },
      };
      
      allSessions.forEach(session => {
        const trackName = session.trackName?.toLowerCase() || '';
        let frequency = 'Alpha';
        
        if (trackName.includes('theta')) frequency = 'Theta';
        else if (trackName.includes('beta')) frequency = 'Beta';
        else if (trackName.includes('delta')) frequency = 'Delta';
        
        frequencyCount[frequency].count++;
        frequencyCount[frequency].totalDuration += session.duration / 60;
      });
      
      const totalFreqCount = Object.values(frequencyCount).reduce((sum, f) => sum + f.count, 0);
      const frequencyUsage = Object.entries(frequencyCount).map(([name, data]) => ({
        name: `${name} (${getFrequencyRange(name)})`,
        count: data.count,
        percentage: totalFreqCount > 0 ? Math.round((data.count / totalFreqCount) * 100) : 0,
        avgDuration: data.count > 0 ? Math.round(data.totalDuration / data.count) : 0,
      })).sort((a, b) => b.count - a.count);
      
      // Calculate frequency effectiveness
      const frequencyStats: Record<string, { completed: number; total: number; ratings: number[]; users: Set<string> }> = {
        'Alpha': { completed: 0, total: 0, ratings: [], users: new Set() },
        'Theta': { completed: 0, total: 0, ratings: [], users: new Set() },
        'Beta': { completed: 0, total: 0, ratings: [], users: new Set() },
        'Delta': { completed: 0, total: 0, ratings: [], users: new Set() },
      };
      
      allSessions.forEach(session => {
        const trackName = session.trackName?.toLowerCase() || '';
        let frequency = 'Alpha';
        
        if (trackName.includes('theta')) frequency = 'Theta';
        else if (trackName.includes('beta')) frequency = 'Beta';
        else if (trackName.includes('delta')) frequency = 'Delta';
        
        frequencyStats[frequency].total++;
        if (session.completed) frequencyStats[frequency].completed++;
        if (session.effectiveness) frequencyStats[frequency].ratings.push(session.effectiveness);
        if (session.userId) frequencyStats[frequency].users.add(session.userId.toString());
      });
      
      const frequencyEffectiveness = Object.entries(frequencyStats).map(([frequency, stats]) => ({
        frequency,
        completionRate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
        avgRating: stats.ratings.length > 0 
          ? Math.round((stats.ratings.reduce((sum, r) => sum + r, 0) / stats.ratings.length) * 10) / 10
          : 0,
        userCount: stats.users.size,
      })).sort((a, b) => b.completionRate - a.completionRate);
      
      // Calculate user preferences
      const categoryCount: Record<string, number> = {};
      allSessions.forEach(session => {
        const category = session.goal || session.category || 'focus';
        const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);
        categoryCount[capitalizedCategory] = (categoryCount[capitalizedCategory] || 0) + 1;
      });
      
      const totalCategories = Object.values(categoryCount).reduce((sum, c) => sum + c, 0);
      const userPreferences = Object.entries(categoryCount).map(([category, count]) => ({
        category,
        count,
        percentage: totalCategories > 0 ? Math.round((count / totalCategories) * 100) : 0,
      })).sort((a, b) => b.count - a.count);
      
      // Calculate mental state distribution (current active sessions)
      const recentSessions = allSessions.filter(s => now - s.timestamp < 3600000); // Last hour
      const stateCount: Record<string, number> = {};
      
      recentSessions.forEach(session => {
        const category = session.goal || session.category || 'focus';
        const state = category === 'focus' ? 'Focused' 
                    : category === 'relaxation' ? 'Relaxed'
                    : category === 'creativity' ? 'Creative'
                    : category === 'sleep' ? 'Sleeping'
                    : 'Focused';
        stateCount[state] = (stateCount[state] || 0) + 1;
      });
      
      const totalStates = Object.values(stateCount).reduce((sum, c) => sum + c, 0);
      const mentalStateDistribution = Object.entries(stateCount).map(([state, count]) => ({
        state,
        count,
        percentage: totalStates > 0 ? Math.round((count / totalStates) * 100) : 0,
      })).sort((a, b) => b.count - a.count);
      
      // Calculate user retention (last 7 days)
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const userRetention = days.map((day, index) => {
        const targetDate = new Date(now - (6 - index) * 86400000);
        const dayStart = new Date(targetDate.setHours(0, 0, 0, 0)).getTime();
        const dayEnd = new Date(targetDate.setHours(23, 59, 59, 999)).getTime();
        
        const daySessions = allSessions.filter(s => s.timestamp >= dayStart && s.timestamp <= dayEnd);
        const dayUsers = new Set(daySessions.map(s => s.userId?.toString())).size;
        
        return {
          day: days[new Date(dayStart).getDay()],
          users: dayUsers,
          sessions: daySessions.length,
        };
      });
      
      // Get recent activity
      const recentActivity = allSessions
        .slice(-10)
        .reverse()
        .map(session => {
          const user = users.find(u => u._id.toString() === session.userId?.toString());
          return {
            userId: session.userId?.toString() || 'unknown',
            userName: user?.name || user?.email?.split('@')[0] || 'Anonymous',
            action: session.completed 
              ? `Completed ${session.trackName} session`
              : `Started ${session.trackName} session`,
            timestamp: new Date(session.timestamp).toISOString(),
          };
        });
      
      return NextResponse.json({
        scientistName: 'Researcher',
        totalUsers,
        activeUsers,
        totalSessions,
        avgSessionDuration,
        frequencyUsage,
        frequencyEffectiveness,
        userPreferences,
        mentalStateDistribution: mentalStateDistribution.length > 0 
          ? mentalStateDistribution 
          : [{ state: 'No active users', count: 0, percentage: 0 }],
        userRetention,
        recentActivity,
      });
    } catch (dbError) {
      console.error('Database error, falling back to mock data:', dbError);
      return NextResponse.json(getMockDashboardData());
    }
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
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
    scientistName: 'Demo Researcher',
    totalUsers: 156,
    activeUsers: 89,
    totalSessions: 1247,
    avgSessionDuration: 28,
    frequencyUsage: [
      { name: 'Alpha (8-12 Hz)', count: 523, percentage: 42, avgDuration: 32 },
      { name: 'Theta (4-8 Hz)', count: 361, percentage: 29, avgDuration: 25 },
      { name: 'Beta (13-30 Hz)', count: 237, percentage: 19, avgDuration: 22 },
      { name: 'Delta (0.5-4 Hz)', count: 126, percentage: 10, avgDuration: 45 },
    ],
    frequencyEffectiveness: [
      { frequency: 'Alpha', completionRate: 87, avgRating: 4.5, userCount: 142 },
      { frequency: 'Theta', completionRate: 82, avgRating: 4.3, userCount: 118 },
      { frequency: 'Beta', completionRate: 79, avgRating: 4.1, userCount: 95 },
      { frequency: 'Delta', completionRate: 91, avgRating: 4.7, userCount: 67 },
    ],
    userPreferences: [
      { category: 'Focus', count: 512, percentage: 41 },
      { category: 'Relaxation', count: 374, percentage: 30 },
      { category: 'Creativity', count: 237, percentage: 19 },
      { category: 'Sleep', count: 124, percentage: 10 },
    ],
    mentalStateDistribution: [
      { state: 'Focused', count: 45, percentage: 51 },
      { state: 'Relaxed', count: 28, percentage: 31 },
      { state: 'Creative', count: 12, percentage: 13 },
      { state: 'Sleeping', count: 4, percentage: 5 },
    ],
    userRetention: [
      { day: 'Mon', users: 67, sessions: 145 },
      { day: 'Tue', users: 72, sessions: 168 },
      { day: 'Wed', users: 81, sessions: 192 },
      { day: 'Thu', users: 76, sessions: 178 },
      { day: 'Fri', users: 69, sessions: 156 },
      { day: 'Sat', users: 58, sessions: 134 },
      { day: 'Sun', users: 54, sessions: 118 },
    ],
    recentActivity: [
      { userId: '1', userName: 'John', action: 'Completed Alpha session', timestamp: new Date(Date.now() - 300000).toISOString() },
      { userId: '2', userName: 'Jane', action: 'Started Theta meditation', timestamp: new Date(Date.now() - 600000).toISOString() },
      { userId: '3', userName: 'Mike', action: 'Completed Beta focus session', timestamp: new Date(Date.now() - 900000).toISOString() },
    ],
  };
}
