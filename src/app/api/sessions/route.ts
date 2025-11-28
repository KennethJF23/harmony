import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const body = await request.json();
    
    const { trackId, trackName, duration, completed, goal, frequency, mood, effectiveness } = body;

    if (!trackName || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Skip saving to DB in development with mock tokens
    if (process.env.NODE_ENV === 'development' && token.startsWith('mock-token')) {
      return NextResponse.json({ success: true, message: 'Session tracked (mock)' });
    }

    const { db } = await connectToDatabase();
    
    // Get user from token (simplified - in production you'd verify JWT)
    const user = await db.collection('users').findOne({ sessionToken: token });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Save session to database
    const session = {
      userId: user._id,
      trackId: trackId || 0,
      trackName,
      duration, // in seconds
      timestamp: Date.now(),
      completed: completed || false,
      goal: goal || 'focus',
      frequency: frequency || 'alpha',
      mood: mood || null,
      effectiveness: effectiveness || null,
      category: goal || 'focus',
    };

    await db.collection('sessions').insertOne(session);

    return NextResponse.json({ success: true, message: 'Session tracked successfully' });
  } catch (error) {
    console.error('Session tracking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
