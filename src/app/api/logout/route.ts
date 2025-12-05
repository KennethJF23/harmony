import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, role } = body;

    // Validation
    if (!email || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to database and clear session token
    try {
      const { db } = await connectToDatabase();
      const usersCollection = db.collection('users');
      
      await usersCollection.updateOne(
        { email, role },
        {
          $set: {
            sessionToken: null,
            lastLogout: new Date(),
          },
        }
      );
    } catch (dbError) {
      console.error('Database error during logout:', dbError);
      // Continue with logout even if DB update fails
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Logged out successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
