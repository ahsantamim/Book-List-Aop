'use client';

type Book = {
  id: string;
  title: string;
  author: string;
  description?: string | null;
};

type BookListProps = {
  books: Book[];
  onDelete: (id: string) => Promise<void>;
};

export default function BookList({ books, onDelete }: BookListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {books.map((book) => (
        <div
          key={book.id}
          className="bg-white overflow-hidden shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {book.title}
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              by {book.author}
            </p>
            {book.description && (
              <p className="mt-3 text-sm text-gray-500">
                {book.description}
              </p>
            )}
            <div className="mt-4">
              <button
                onClick={() => onDelete(book.id)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
