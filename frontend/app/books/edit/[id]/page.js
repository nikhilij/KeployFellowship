'use client';

import { useEffect, useState } from 'react';
import { getBook } from '../../../../lib/api';
import BookForm from '../../../../components/BookForm';
import Header from '../../../../components/Header';

export default function EditBook({ params }) {
  const { id } = params;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await getBook(id);
        setBook(data);
      } catch (err) {
        console.error('Failed to fetch book:', err);
        setError('Failed to load book data. Please try again or go back to the book list.');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="container mx-auto py-8 px-4 flex-grow flex flex-col items-center">
          <p className="text-center">Loading book data...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="container mx-auto py-8 px-4 flex-grow flex flex-col items-center">
          <div className="bg-red-50 p-4 rounded border border-red-200 text-red-700 mb-4">
            {error}
          </div>
          <a href="/" className="text-blue-600 hover:underline">
            Back to Book List
          </a>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto py-8 px-4 flex-grow flex flex-col items-center">
        <BookForm book={book} />
      </main>
    </div>
  );
}
