import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin';
import { prisma } from '@/lib/prisma';

async function getUserFromSession() {
  try {
    const cookieStore = cookies();
    const sessionCookie = await cookieStore.get('session');
    
    if (!sessionCookie?.value) {
      return null;
    }

    const decodedClaim = await adminAuth.verifySessionCookie(sessionCookie.value, true);
    return decodedClaim;
  } catch (error) {
    console.error('Error verifying session:', error);
    return null;
  }
}

// Get all books
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get('scope') || 'public'; // 'public' or 'user'
    const user = await getUserFromSession();

    // For user-specific books, require authentication
    if (scope === 'user') {
      if (!user) {
        return NextResponse.json(
          { error: 'Unauthorized - Please sign in' },
          { status: 401 }
        );
      }

      const userBooks = await prisma.book.findMany({
        where: {
          userId: user.uid
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {
            select: {
              name: true,
            }
          }
        }
      });

      return NextResponse.json(userBooks);
    }

    // For public books, return all books regardless of authentication
    const allBooks = await prisma.book.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
          }
        }
      }
    });

    return NextResponse.json(allBooks);
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}

// Add a new book (requires auth)
export async function POST(request: Request) {
  try {
    const user = await getUserFromSession();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { title, author, genre, description } = body;

    if (!title || !author || !genre || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // First ensure the user exists in the database
    const dbUser = await prisma.user.upsert({
      where: { id: user.uid },
      update: {
        email: user.email || '',
        name: user.name || user.email?.split('@')[0] || 'Anonymous'
      },
      create: {
        id: user.uid,
        email: user.email || '',
        name: user.name || user.email?.split('@')[0] || 'Anonymous'
      }
    });

    // Now create the book with the confirmed user ID
    const book = await prisma.book.create({
      data: {
        title,
        author,
        genre,
        description,
        userId: dbUser.id,
        rating: 0
      },
    });

    return NextResponse.json({ book, message: 'Book created successfully' });
  } catch (error) {
    console.error('Error creating book:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create book' },
      { status: 500 }
    );
  }
}

// Update a book (requires auth and ownership)
export async function PUT(request: Request) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, title, author, genre, description } = body;

    // Check if the book exists and belongs to the user
    const existingBook = await prisma.book.findUnique({
      where: { id },
    });

    if (!existingBook) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    if (existingBook.userId !== user.uid) {
      return NextResponse.json(
        { error: 'Unauthorized - You can only update your own books' },
        { status: 403 }
      );
    }

    const updatedBook = await prisma.book.update({
      where: { id },
      data: {
        title,
        author,
        genre,
        description
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
