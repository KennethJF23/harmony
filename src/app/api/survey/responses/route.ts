import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userEmail,
      sessionId,
      questionId,
      question,
      answer,
      timestamp,
      trackName,
      category,
      questionType,
    } = body;

    if (!userEmail || !sessionId || !questionId || !answer) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Save survey response
    await db.collection('survey_responses').insertOne({
      userEmail,
      sessionId,
      questionId,
      question,
      answer,
      timestamp,
      trackName,
      category,
      questionType,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving survey response:', error);
    return NextResponse.json(
      { error: 'Failed to save survey response' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get('userEmail');
    const sessionId = searchParams.get('sessionId');

    const { db } = await connectToDatabase();

    const query: any = {};
    if (userEmail) query.userEmail = userEmail;
    if (sessionId) query.sessionId = sessionId;

    const responses = await db
      .collection('survey_responses')
      .find(query)
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    return NextResponse.json({ responses });
  } catch (error) {
    console.error('Error fetching survey responses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch survey responses' },
      { status: 500 }
    );
  }
}
