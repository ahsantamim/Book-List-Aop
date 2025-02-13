import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get('Authorization');
    if (!authorization?.startsWith('Bearer ')) {
      console.error('No bearer token provided');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authorization.split('Bearer ')[1];
    
    try {
      // Verify the token
      const decodedToken = await adminAuth.verifyIdToken(token);
      console.log('Token verified:', decodedToken.uid);

      // Create a session cookie
      const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
      const sessionCookie = await adminAuth.createSessionCookie(token, { expiresIn });
      console.log('Session cookie created');

      // Set the cookie
      cookies().set('session', sessionCookie, {
        maxAge: expiresIn,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      });

      return NextResponse.json({ status: 'success' });
    } catch (error) {
      console.error('Error verifying token or creating session:', error);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error) {
    console.error('Error in session API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
