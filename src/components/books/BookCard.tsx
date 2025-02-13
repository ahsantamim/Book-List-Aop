'use client';

import { memo, useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import toast from 'react-hot-toast';

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  createdAt: string;
}

interface BookCardProps {
  book: Book;
  onDelete: (id: string) => Promise<void>;
}

const BookCard = memo(function BookCard({ book, onDelete }: BookCardProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await onDelete(book.id);
      toast.success('Book deleted successfully! 🗑️');
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error('Failed to delete book. Please try again.');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{book.title}</h3>
              <p className="text-gray-600 text-sm mb-2">by {book.author}</p>
            </div>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="text-gray-400 hover:text-red-500 transition-colors duration-200"
              aria-label="Delete book"
              disabled={isDeleting}
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="mb-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              {book.genre}
            </span>
          </div>
          <p className="text-gray-600 text-sm line-clamp-3">{book.description}</p>
          <div className="mt-4 text-xs text-gray-500">
            Added on {new Date(book.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        bookTitle={book.title}
        onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
});

export default BookCard;
