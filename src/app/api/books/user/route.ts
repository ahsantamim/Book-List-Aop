import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin';
import { prisma } from '@/lib/prisma';

async function getUserFromSession() {
  const sessionCookie = cookies().get('session')?.value;
  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedClaim = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decodedClaim;
  } catch (error) {
    console.error('Error verifying session:', error);
    return null;
  }
}

export async function GET() {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const books = await prisma.book.findMany({
      where: {
        userId: user.uid,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(books);
  } catch (error) {
    console.error('Error fetching user books:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
