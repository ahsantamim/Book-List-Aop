import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (!token) {
      console.error('No token provided');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
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
    } catch (verifyError) {
      console.error('Error verifying token:', verifyError);
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error in users API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
