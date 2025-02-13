'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import BookModal from '@/components/books/BookModal';
import BookCard from '@/components/books/BookCard';
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  userId: string;
  createdAt: string;
  rating?: number;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'author' | 'date' | 'rating'>('date');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showUnicorn, setShowUnicorn] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  const fetchBooks = useCallback(async () => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/books');
      if (!response.ok) throw new Error('Failed to fetch books');
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    } else if (user) {
      fetchBooks();
    }
  }, [user, loading, router, fetchBooks]);

  const handleAddBook = async (bookData: { title: string; author: string; genre: string; description: string }) => {
    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });

      if (!response.ok) throw new Error('Failed to add book');
      const newBook = await response.json();

      setBooks(prevBooks => [newBook, ...prevBooks]);
      setIsModalOpen(false);
      toast.success('Book added successfully! 📚');
      triggerUnicorn();
    } catch (error) {
      console.error('Error adding book:', error);
      toast.error('Failed to add book. Please try again.');
      throw error;
    }
  };

  const handleDeleteBook = async (id: string) => {
    try {
      const previousBooks = [...books];
      setBooks(prevBooks => prevBooks.filter(book => book.id !== id));

      const response = await fetch(`/api/books/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        setBooks(previousBooks);
        throw new Error('Failed to delete book');
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      throw error;
    }
  };

  const handleUpdateBook = async (id: string, bookData: Omit<Book, 'id' | 'createdAt' | 'userId'>) => {
    try {
      const response = await fetch(`/api/books?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });

      if (!response.ok) throw new Error('Failed to update book');
      const updatedBook = await response.json();

      setBooks(prevBooks =>
        prevBooks.map(book =>
          book.id === id ? { ...book, ...updatedBook } : book
        )
      );
      toast.success('Book updated successfully! 📚');
    } catch (error) {
      console.error('Error updating book:', error);
      toast.error('Failed to update book. Please try again.');
      throw error;
    }
  };

  const handleRateBook = async (id: string, rating: number) => {
    try {
      console.log('Rating book:', { id, rating });
      
      if (!id || typeof rating !== 'number' || rating < 1 || rating > 5) {
        throw new Error('Invalid rating parameters');
      }

      const response = await fetch(`/api/books/rate?id=${id}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating }),
        credentials: 'include', // Include cookies in the request
      });

      console.log('Response status:', response.status);
      
      // Get the response text first
      const responseText = await response.text();
      console.log('Response text:', responseText);

      // Try to parse the response as JSON
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Parsed response:', data);
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        throw new Error('Server returned an invalid response');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to rate book');
      }

      if (!data.success || !data.book) {
        console.error('Invalid response format:', data);
        throw new Error('Invalid response format from server');
      }

      console.log('Updating book rating:', data.book);
      setBooks(prevBooks =>
        prevBooks.map(book =>
          book.id === id ? { ...book, rating: data.book.rating } : book
        )
      );
      
      toast.success(data.message || 'Rating updated successfully! ⭐');
    } catch (error) {
      console.error('Error rating book:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update rating');
    }
  };

  const uniqueGenres = useMemo(() => {
    const genres = new Set(books.map(book => book.genre));
    return ['all', ...Array.from(genres)];
  }, [books]);

  const sortBooks = (books: Book[]) => {
    switch (sortBy) {
      case 'title':
        return [...books].sort((a, b) => a.title.localeCompare(b.title));
      case 'author':
        return [...books].sort((a, b) => a.author.localeCompare(b.author));
      case 'rating':
        return [...books].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'date':
      default:
        return [...books].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  };

  const triggerUnicorn = () => {
    setShowUnicorn(true);
    setTimeout(() => setShowUnicorn(false), 2000);
  };

  const filteredAndSortedBooks = useMemo(() => {
    return sortBooks(
      books
        .filter((book) => {
          const matchesSearch = 
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.genre.toLowerCase().includes(searchQuery.toLowerCase());
          
          const matchesGenre = selectedGenre === 'all' || book.genre === selectedGenre;
          
          return matchesSearch && matchesGenre;
        })
    );
  }, [books, searchQuery, sortBy, selectedGenre]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">My Books</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Book
        </button>
      </div>

      <div className="mb-6 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1 max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {uniqueGenres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre.charAt(0).toUpperCase() + genre.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'title' | 'author' | 'date' | 'rating')}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="date">Date Added</option>
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      <div className="relative">
        <AnimatePresence>
          {showUnicorn && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: -100, opacity: 1 }}
              exit={{ y: -300, opacity: 0 }}
              transition={{ duration: 2 }}
              className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50"
            >
              <span className="text-6xl">🦄</span>
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-48"></div>
            ))}
          </div>
        ) : filteredAndSortedBooks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchQuery || selectedGenre !== 'all' 
                ? 'No books found matching your criteria.' 
                : 'No books found. Add your first book!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedBooks.map((book) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <BookCard
                  book={book}
                  onDelete={handleDeleteBook}
                  onUpdate={handleUpdateBook}
                  onRate={handleRateBook}
                />
              </motion.div>
            ))}
          </div>
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
