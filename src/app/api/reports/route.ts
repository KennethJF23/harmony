import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

// Helper to get user from token
async function getUserFromToken(token: string | null) {
  if (!token) return null;
  
  const { db } = await connectToDatabase();
  const usersCollection = db.collection('users');
  
  const user = await usersCollection.findOne({ sessionToken: token });
  return user;
}

// POST - Create a new report (for general users)
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '') || null;
    const user = await getUserFromToken(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { trackId, duration, mood, notes, sessionData } = body;

    if (!trackId || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to database
    const { db } = await connectToDatabase();
    const reportsCollection = db.collection('reports');

    // Create report document
    const reportDocument = {
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      trackId,
      duration,
      mood: mood || null,
      notes: notes || '',
      sessionData: sessionData || {},
      createdAt: new Date(),
    };

    const result = await reportsCollection.insertOne(reportDocument);

    return NextResponse.json(
      {
        success: true,
        message: 'Report submitted successfully',
        reportId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Report submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Retrieve reports (neurologists can see all, users see only their own)
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '') || null;
    const user = await getUserFromToken(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();
    const reportsCollection = db.collection('reports');

    let reports;

    if (user.role === 'neurologist') {
      // Neurologists can see all reports
      reports = await reportsCollection
        .find({})
        .sort({ createdAt: -1 })
        .limit(100)
        .toArray();
    } else {
      // Users can only see their own reports
      reports = await reportsCollection
        .find({ userId: user._id })
        .sort({ createdAt: -1 })
        .limit(50)
        .toArray();
    }

    return NextResponse.json(
      {
        success: true,
        reports,
        count: reports.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Reports retrieval error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
