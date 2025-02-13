'use client';

import { useEffect, useState } from 'react';
import BookList from '@/components/books/BookList';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import BookModal from '@/components/books/BookModal';
import { PlusIcon } from '@heroicons/react/24/outline';
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

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

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
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to add book');
      }

      await fetchBooks();
      setIsModalOpen(false);
      toast.success('Book added successfully!');
    } catch (error) {
      console.error('Error adding book:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add book');
      throw error;
    }
  };

  const handleDeleteBook = async (id: string) => {
    // Only allow deleting if it's the user's book
    const book = books.find(b => b.id === id);
    if (!book || book.userId !== user?.uid) {
      toast.error('You can only delete your own books');
      return;
    }

    try {
      const response = await fetch(`/api/books/delete?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete book');
      }

      await fetchBooks();
      toast.success('Book deleted successfully');
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete book');
    }
  };

  const handleUpdateBook = async (id: string, bookData: Omit<Book, 'id' | 'createdAt'>) => {
    // Only allow updating if it's the user's book
    const book = books.find(b => b.id === id);
    if (!book || book.userId !== user?.uid) {
      toast.error('You can only edit your own books');
      return;
    }

    try {
      const response = await fetch(`/api/books/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...bookData }),
      });

      if (!response.ok) {
        throw new Error('Failed to update book');
      }

      await fetchBooks();
      toast.success('Book updated successfully');
    } catch (error) {
      console.error('Error updating book:', error);
      toast.error('Failed to update book');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Book Collection</h1>
            <p className="mt-1 text-gray-500">Discover and rate amazing books</p>
          </div>
          {user && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
            >
              <PlusIcon className="h-5 w-5" />
              Add New Book
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <BookList 
            books={books} 
            onDelete={handleDeleteBook}
            onUpdate={handleUpdateBook}
            variant="user"
          />
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
