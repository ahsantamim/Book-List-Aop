'use client';

import { useEffect, useState } from 'react';
import BookList from '@/components/books/BookList';
import toast from 'react-hot-toast';

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  rating: number;
  createdAt: string;
  userId: string;
  user: {
    name: string;
  };
}

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/books?scope=public');
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch books');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Book List</h1>
          <p className="mt-1 text-gray-500">Discover amazing books from our community</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <BookList 
            books={books} 
            variant="public"
          />
        )}
      </div>
    </div>
  );
}
