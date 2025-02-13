import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get('Authorization');
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authorization.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);

    const { title, author, description } = await request.json();

    const book = await prisma.book.create({
      data: {
        title,
        author,
        description,
        userId: decodedToken.uid,
      },
    });

    return NextResponse.json(book);
  } catch (error) {
    console.error('Failed to create book:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const authorization = request.headers.get('Authorization');
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authorization.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);

    const books = await prisma.book.findMany({
      where: {
        userId: decodedToken.uid,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(books);
  } catch (error) {
    console.error('Failed to fetch books:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
