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

export async function PUT(request: Request) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, title, author, genre, description, rating } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
    }

    // Check if book exists and belongs to user
    const book = await prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    // For rating updates, allow any authenticated user
    // For other updates, require ownership
    if (!rating && book.userId !== user.uid) {
      return NextResponse.json(
        { error: 'Not authorized to edit this book' },
        { status: 403 }
      );
    }

    // Update the book
    const updatedBook = await prisma.book.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(author && { author }),
        ...(genre && { genre }),
        ...(description && { description }),
        ...(typeof rating === 'number' && { rating }),
      },
    });

    return NextResponse.json(updatedBook);
  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json(
      { error: 'Failed to update book' },
      { status: 500 }
    );
  }
}
