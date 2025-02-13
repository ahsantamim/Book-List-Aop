import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // Get and verify session
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie?.value) {
      return NextResponse.json(
        { success: false, error: 'You must be logged in to rate books' },
        { status: 401 }
      );
    }

    // Verify the session cookie
    let decodedClaim;
    try {
      decodedClaim = await adminAuth.verifySessionCookie(sessionCookie.value, true);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid session' },
        { status: 401 }
      );
    }

    // Get book ID from query params
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get('id');
    
    if (!bookId) {
      return NextResponse.json(
        { success: false, error: 'Book ID is required' },
        { status: 400 }
      );
    }

    // Parse request body for rating
    const body = await request.json();
    const { rating } = body;

    if (typeof rating !== 'number' || rating < 0 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be a number between 0 and 5' },
        { status: 400 }
      );
    }

    // Update book rating
    const book = await prisma.book.update({
      where: { id: bookId },
      data: { rating },
    });

    return NextResponse.json({ success: true, book });
  } catch (error) {
    console.error('Error rating book:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update book rating' },
      { status: 500 }
    );
  }
}
