import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    console.log('Handling book rating request...');
    
    // Get and verify session
    const cookieStore = cookies();
    const sessionCookie = await Promise.resolve(cookieStore.get('session'));
    console.log('Session cookie present:', !!sessionCookie?.value);

    if (!sessionCookie?.value) {
      console.log('No session cookie found');
      return NextResponse.json(
        { success: false, error: 'You must be logged in to rate books' },
        { status: 401 }
      );
    }

    // Verify the session cookie
    let decodedClaim;
    try {
      decodedClaim = await adminAuth.verifySessionCookie(sessionCookie.value, true);
      console.log('Session verified for user:', decodedClaim.uid);
    } catch (error) {
      console.error('Session verification failed:', error);
      return NextResponse.json(
        { success: false, error: 'Invalid session' },
        { status: 401 }
      );
    }

    // Get book ID from query params
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get('id');
    console.log('Book ID from params:', bookId);
    
    if (!bookId) {
      console.log('No book ID provided');
      return NextResponse.json(
        { success: false, error: 'Book ID is required' },
        { status: 400 }
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log('Request body:', body);
    } catch (error) {
      console.error('Failed to parse request body:', error);
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Validate rating
    const rating = Number(body?.rating);
    console.log('Parsed rating:', rating);

    if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
      console.log('Invalid rating value:', rating);
      return NextResponse.json(
        { success: false, error: 'Rating must be a number between 1 and 5' },
        { status: 400 }
      );
    }

    try {
      // First check if the book exists and belongs to the user
      const book = await prisma.book.findUnique({
        where: {
          id: bookId,
        },
        select: {
          userId: true
        }
      });

      if (!book) {
        return NextResponse.json(
          { success: false, error: 'Book not found' },
          { status: 404 }
        );
      }

      if (book.userId !== decodedClaim.uid) {
        return NextResponse.json(
          { success: false, error: 'You do not have permission to rate this book' },
          { status: 403 }
        );
      }

      console.log('Updating book rating in database...');
      const updatedBook = await prisma.book.update({
        where: {
          id: bookId
        },
        data: {
          rating: rating
        },
        select: {
          id: true,
          rating: true,
          title: true
        }
      });

      console.log('Book updated successfully:', updatedBook);
      return NextResponse.json({
        success: true,
        message: 'Rating updated successfully',
        book: updatedBook
      });
    } catch (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to update book rating in database'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Unexpected error while rating book:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'An unexpected error occurred while rating the book'
      },
      { status: 500 }
    );
  }
}
