'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import SignIn from '@/components/auth/SignIn';
import SignUp from '@/components/auth/SignUp';
import { HomeIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/books');
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="relative">
          <Link 
            href="/"
            className="absolute -top-16 left-1/2 transform -translate-x-1/2 inline-flex items-center gap-2 px-4 py-2 
                     bg-white text-blue-600 rounded-full shadow-lg hover:shadow-xl hover:scale-105 
                     transition-all duration-300 border border-blue-100 group"
          >
            <HomeIcon className="h-5 w-5 group-hover:animate-bounce" />
            <span className="font-medium">Back to Home</span>
          </Link>
          
          <div className="flex justify-center">
            <BookOpenIcon className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isSignIn ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isSignIn ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setIsSignIn(!isSignIn)}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {isSignIn ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        {isSignIn ? <SignIn /> : <SignUp />}
      </div>
    </div>
  );
}
