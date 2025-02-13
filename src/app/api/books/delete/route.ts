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

export async function DELETE(request: Request) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get('id');

    if (!bookId) {
      return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
    }

    // Check if book exists and belongs to user
    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    if (book.userId !== user.uid) {
      return NextResponse.json(
        { error: 'Not authorized to delete this book' },
        { status: 403 }
      );
    }

    // Delete the book
    await prisma.book.delete({
      where: { id: bookId },
    });

    return NextResponse.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
