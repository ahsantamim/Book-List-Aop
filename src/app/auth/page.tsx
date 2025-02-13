'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SignIn from '@/components/auth/SignIn';
import SignUp from '@/components/auth/SignUp';
import { useAuth } from '@/context/auth-context';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Toaster } from 'react-hot-toast';

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/books');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      <div className="max-w-md mx-auto pt-8">
        <div className="flex justify-center space-x-4 mb-8">
          <button
            className={`px-4 py-2 rounded-md ${
              isSignIn
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
            onClick={() => setIsSignIn(true)}
          >
            Sign In
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              !isSignIn
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
            onClick={() => setIsSignIn(false)}
          >
            Sign Up
          </button>
        </div>
        {isSignIn ? (
          <SignIn />
        ) : (
          <SignUp onSuccess={() => {
            setIsSignIn(true);
          }} />
        )}
      </div>
    </div>
  );
}
