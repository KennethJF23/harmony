import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role, licenseNumber, institution } = body;

    console.log('Registration attempt:', { name, email, role });

    // Validation
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    if (!['user', 'neuroscientist'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    if (role === 'neuroscientist' && !licenseNumber) {
      return NextResponse.json(
        { error: 'License number is required for neuroscientists' },
        { status: 400 }
      );
    }

    // Connect to database
    console.log('Connecting to database...');
    const { db } = await connectToDatabase();
    console.log('Database connected');
    
    const usersCollection = db.collection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user document
    const userDocument: any = {
      name,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add neuroscientist-specific fields
    if (role === 'neuroscientist') {
      userDocument.licenseNumber = licenseNumber;
      if (institution) {
        userDocument.institution = institution;
      }
    }

    // Insert user
    const result = await usersCollection.insertOne(userDocument);

    console.log('User registered successfully:', result.insertedId);

    // Return success (without password)
    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully',
        userId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
