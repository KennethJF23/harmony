import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role, licenseNumber, institution } = body;

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

    if (!['user', 'neurologist'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    if (role === 'neurologist' && !licenseNumber) {
      return NextResponse.json(
        { error: 'License number is required for neurologists' },
        { status: 400 }
      );
    }

    // Connect to database
    const { db } = await connectToDatabase();
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

    // Add neurologist-specific fields
    if (role === 'neurologist') {
      userDocument.licenseNumber = licenseNumber;
      if (institution) {
        userDocument.institution = institution;
      }
    }

    // Insert user
    const result = await usersCollection.insertOne(userDocument);

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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
