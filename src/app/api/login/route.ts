import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyPassword, createToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, role } = body;

    // Validation
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['user', 'neuroscientist'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Mock authentication for development (bypasses MongoDB)
    if (process.env.NODE_ENV === 'development') {
      const token = `mock-token-${Date.now()}`;
      
      return NextResponse.json(
        {
          success: true,
          token,
          role: role,
          user: {
            id: 'mock-user-id',
            name: email.split('@')[0],
            email: email,
            role: role,
            ...(role === 'neuroscientist' && {
              licenseNumber: 'MOCK-12345',
              institution: 'Development Hospital',
            }),
          },
        },
        { status: 200 }
      );
    }

    // Production: Connect to database
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Find user by email and role
    const user = await usersCollection.findOne({ email, role });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create session token
    const token = createToken();

    // Update last login
    await usersCollection.updateOne(
      { _id: user._id },
      { 
        $set: { 
          lastLogin: new Date(),
          sessionToken: token 
        } 
      }
    );

    // Return success with token and user info (without password)
    return NextResponse.json(
      {
        success: true,
        token,
        role: user.role,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          ...(user.role === 'neuroscientist' && {
            licenseNumber: user.licenseNumber,
            institution: user.institution,
          }),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
