'use client';

import { memo, useState } from 'react';
import { TrashIcon, PencilSquareIcon } from '@heroicons/react/24/solid';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import EditBookModal from './EditBookModal';
import RatingStars from './RatingStars';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  rating: number;
  createdAt: string;
  userId?: string;
  user?: {
    name: string;
  };
}

interface BookCardProps {
  book: Book;
  onDelete?: (id: string) => Promise<void>;
  onUpdate?: (id: string, data: Omit<Book, 'id' | 'createdAt'>) => Promise<void>;
  variant?: 'user' | 'public';
}

function BookCard({ 
  book, 
  onDelete,
  onUpdate,
  variant = 'public'
}: BookCardProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  // If not logged in, redirect to auth page
  const handleAuthRequired = () => {
    toast.error('Please sign in to perform this action');
    router.push('/auth');
  };

  const handleDelete = async () => {
    if (!user) {
      handleAuthRequired();
      return;
    }

    if (!onDelete) return;

    try {
      const response = await fetch(`/api/books/delete?id=${book.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete book');
      }

      setIsDeleteModalOpen(false);
      onDelete(book.id);
      toast.success('Book deleted successfully');
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete book');
    }
  };

  const handleUpdate = async (updatedData: Omit<Book, 'id' | 'createdAt' | 'rating' | 'userId'>) => {
    if (!user) {
      handleAuthRequired();
      return;
    }

    if (!onUpdate) return;

    try {
      const response = await fetch(`/api/books/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: book.id, ...updatedData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update book');
      }

      onUpdate(book.id, { ...updatedData, rating: book.rating });
      setIsEditModalOpen(false);
      toast.success('Book updated successfully');
    } catch (error) {
      console.error('Error updating book:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update book');
    }
  };

  const handleRate = async (rating: number) => {
    if (!user) {
      handleAuthRequired();
      return;
    }
    
    if (!onUpdate) return;

    try {
      const response = await fetch(`/api/books/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: book.id,
          rating 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update rating');
      }

      onUpdate(book.id, { 
        title: book.title,
        author: book.author,
        genre: book.genre,
        description: book.description,
        rating,
        userId: book.userId 
      });
      toast.success('Rating updated successfully');
    } catch (error) {
      console.error('Failed to rate book:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update rating');
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{book.title}</h3>
              <p className="text-gray-600 text-sm">by {book.author}</p>
              {book.user?.name && (
                <p className="text-gray-500 text-xs mt-1">Added by {book.user.name}</p>
              )}
            </div>

            {variant === 'user' && user && book.userId === user.uid && (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                  title="Edit book"
                >
                  <PencilSquareIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete book"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          <div className="mb-3">
            <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              {book.genre}
            </span>
          </div>

          <div className="mb-3">
            <RatingStars rating={book.rating} onRate={handleRate} />
            {!user && (
              <p className="text-xs text-gray-500 mt-1">Sign in to rate this book</p>
            )}
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{book.description}</p>
          
          <p className="text-xs text-gray-500">
            Added {new Date(book.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {variant === 'user' && user && book.userId === user.uid && onDelete && onUpdate && (
        <>
          <DeleteConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDelete}
            title={book.title}
          />

          <EditBookModal
            book={book}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleUpdate}
          />
        </>
      )}
    </>
  );
}

export default memo(BookCard);
