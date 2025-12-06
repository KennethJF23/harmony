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

    // Mock authentication for development: also upsert user in MongoDB so dashboards can count users
    if (process.env.NODE_ENV === 'development') {
      const token = `mock-token-${Date.now()}`;

      try {
        const { db } = await connectToDatabase();
        const usersCollection = db.collection('users');
        await usersCollection.updateOne(
          { email, role },
          {
            $set: {
              name: email.split('@')[0],
              email,
              role,
              lastLogin: new Date(),
              sessionToken: token,
            },
            $setOnInsert: { createdAt: new Date() },
          },
          { upsert: true }
        );

        const saved = await usersCollection.findOne({ email, role });

        return NextResponse.json(
          {
            success: true,
            token,
            role: role,
            user: {
              id: saved?._id ?? 'mock-user-id',
              name: saved?.name ?? email.split('@')[0],
              email: saved?.email ?? email,
              role: saved?.role ?? role,
              ...(role === 'neuroscientist' && {
                licenseNumber: 'MOCK-12345',
                institution: 'Development Hospital',
              }),
            },
          },
          { status: 200 }
        );
      } catch (e) {
        console.warn('Dev upsert user failed:', e);
        // Fallback response without DB persistence
        return NextResponse.json(
          {
            success: true,
            token,
            role: role,
            user: {
              id: 'mock-user-id',
              name: email.split('@')[0],
              email,
              role,
              ...(role === 'neuroscientist' && {
                licenseNumber: 'MOCK-12345',
                institution: 'Development Hospital',
              }),
            },
          },
          { status: 200 }
        );
      }
    }

    // Production: Connect to database
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    // First, find user by email only to check their actual role
    const userByEmail = await usersCollection.findOne({ email });
    
    if (!userByEmail) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if the role matches the registered role
    if (userByEmail.role !== role) {
      return NextResponse.json(
        { error: `This account is registered as a ${userByEmail.role}. Please select the correct account type.` },
        { status: 401 }
      );
    }

    const user = userByEmail;

    // Check if user has a password (some users created in dev mode might not)
    if (!user.password) {
      return NextResponse.json(
        { error: 'Account not properly configured. Please register again.' },
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
