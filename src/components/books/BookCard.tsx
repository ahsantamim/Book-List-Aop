'use client';

import { memo, useState } from 'react';
import { TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import EditBookModal from './EditBookModal';

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
  onUpdate: (id: string, data: Omit<Book, 'id' | 'createdAt'>) => Promise<void>;
}

const BookCard = memo(function BookCard({ book, onDelete, onUpdate }: BookCardProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await onDelete(book.id);
    } catch (error) {
      console.error('Error deleting book:', error);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleUpdate = async (updatedData: Omit<Book, 'id' | 'createdAt'>) => {
    try {
      await onUpdate(book.id, updatedData);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating book:', error);
      throw error;
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
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="text-gray-400 hover:text-indigo-500 transition-colors duration-200"
                aria-label="Edit book"
              >
                <PencilSquareIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                aria-label="Delete book"
                disabled={isDeleting}
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
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

      <EditBookModal
        book={book}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdate}
      />
    </>
  );
});

export default BookCard;
