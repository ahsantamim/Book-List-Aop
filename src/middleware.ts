import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of public paths that don't require authentication
const PUBLIC_PATHS = ['/auth', '/_next', '/favicon.ico'];

// List of protected paths that require authentication
const PROTECTED_PATHS = [
  '/my-books',
  '/api/books'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { method } = request;
  
  // Redirect root to /books
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/books', request.url));
  }

  // Allow public paths
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Special case for /api/books - only GET is public
  if (pathname === '/api/books' && method === 'GET') {
    return NextResponse.next();
  }

  // Check if the path requires authentication
  const requiresAuth = PROTECTED_PATHS.some(path => pathname.startsWith(path));

  if (requiresAuth) {
    // Check for session cookie
    const session = request.cookies.get('session');

    if (!session) {
      // If API request, return unauthorized
      if (pathname.startsWith('/api')) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }
      // Otherwise redirect to auth page
      return NextResponse.redirect(new URL('/auth', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
