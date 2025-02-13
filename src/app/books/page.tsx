'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import BookForm from '@/components/books/BookForm';
import BookList from '@/components/books/BookList';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

type Book = {
  id: string;
  title: string;
  author: string;
  description: string | null;
};

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchBooks();
    }
  }, [user]);

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const token = await user?.getIdToken();
      const response = await fetch('/api/books', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch books');
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBook = async (data: { title: string; author: string; description: string }) => {
    try {
      const token = await user?.getIdToken();
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to add book');
      fetchBooks();
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const handleDeleteBook = async (id: string) => {
    try {
      const token = await user?.getIdToken();
      const response = await fetch(`/api/books/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete book');
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Book List</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your favorite books collection
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Book</h2>
              <BookForm onSubmit={handleAddBook} />
            </div>
          </div>
          <div className="lg:col-span-2">
            {books.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-500">No books added yet. Add your first book!</p>
              </div>
            ) : (
              <BookList books={books} onDelete={handleDeleteBook} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
