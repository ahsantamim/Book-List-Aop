'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import BookModal from '@/components/books/BookModal';
import BookCard from '@/components/books/BookCard';
import { PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  userId: string;
  createdAt: string;
  rating: number;
}

export default function MyBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }

    fetchBooks();
  }, [user, router]);

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/books/user');
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch books');
      }
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('Failed to fetch books');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBook = async (bookData: { title: string; author: string; genre: string; description: string }) => {
    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add book');
      }

      await fetchBooks();
      toast.success('Book added successfully!');
    } catch (error) {
      console.error('Error adding book:', error);
      throw error;
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Books</h1>
            <p className="mt-1 text-gray-500">Manage your personal book collection</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
          >
            <PlusIcon className="h-5 w-5" />
            Add New Book
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No books yet</h3>
              <p className="text-gray-500 mb-6">Start building your collection by adding your first book.</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
                Add Your First Book
              </button>
            </div>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {books.map((book) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <BookCard 
                  book={book}
                  onUpdate={fetchBooks}
                  variant="user"
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <BookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddBook}
      />
    </div>
  );
}
