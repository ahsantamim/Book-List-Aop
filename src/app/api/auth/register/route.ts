import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    try {
      // Create user in Firebase
      const userRecord = await adminAuth.createUser({
        email,
        password,
      });

      // Create user in database
      await prisma.user.create({
        data: {
          id: userRecord.uid,
          email: userRecord.email!,
        },
      });

      return NextResponse.json({ message: 'User created successfully' });
    } catch (error: any) {
      // If Firebase user creation fails
      console.error('Firebase error:', error);
      
      if (error.code === 'auth/email-already-exists') {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 400 }
        );
      }

      if (error.code === 'auth/invalid-email') {
        return NextResponse.json(
          { error: 'Invalid email address' },
          { status: 400 }
        );
      }

      if (error.code === 'auth/weak-password') {
        return NextResponse.json(
          { error: 'Password should be at least 6 characters' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to create account' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Request error:', error);
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
