'use client';

import BookCard from './BookCard';

type Book = {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  createdAt: string;
};

type BookListProps = {
  books: Book[];
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, data: Omit<Book, 'id' | 'createdAt'>) => Promise<void>;
};

export default function BookList({ books, onDelete, onUpdate }: BookListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}
