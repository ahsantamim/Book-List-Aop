import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (!token) {
      return NextResponse.json(
        { error: 'No authorization token provided' },
        { status: 401 }
      );
    }

    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (verifyError) {
      console.error('Error verifying token:', verifyError);
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const { uid, email } = decodedToken;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { id: uid },
    });

    if (existingUser) {
      return NextResponse.json(existingUser);
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        id: uid,
        email: email || '',
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error in users API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
