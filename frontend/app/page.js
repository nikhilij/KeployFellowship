'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchBooks, deleteBook } from '../lib/api';
import Header from '../components/Header';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await fetchBooks();
        setBooks(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError('Failed to load books. Please try again later.');
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(id);
        setBooks(books.filter((book) => book._id !== id));
      } catch (err) {
        console.error('Error deleting book:', err);
        alert('Failed to delete book');
      }
    }
  };

  if (loading) return <div className="container mx-auto p-4">Loading...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto py-8 px-4 flex-grow flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">Books</h1>
        
        {books.length === 0 ? (
          <p>No books found. Add some books to get started.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {books.map((book) => (
              <div key={book._id} className="border p-4 rounded shadow">
                <h2 className="text-xl font-semibold">{book.title}</h2>
                <p className="text-gray-600">By {book.author}</p>
                <p className="mt-2">Published: {book.publishedYear}</p>
                <div className="mt-4 flex space-x-2">
                  <Link 
                    href={`/books/edit/${book._id}`}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(book._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
