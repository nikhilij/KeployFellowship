'use client';

import { useState, useEffect } from 'react';
import { fetchBooks, deleteBook } from '../lib/api';
import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBooks = async () => {
    try {
      setIsLoading(true);
      const data = await fetchBooks();
      setBooks(data);
      setError(null);
    } catch (err) {
      setError('Failed to load books. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(id);
        setBooks(books.filter(book => book._id !== id));
      } catch (err) {
        setError('Failed to delete book. Please try again.');
        console.error(err);
      }
    }
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading books...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded border border-red-200 text-red-700 mb-4">
        {error}
        <button 
          className="ml-4 underline text-blue-600" 
          onClick={() => loadBooks()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Book Collection</h2>
        <Link 
          href="/books/add" 
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Add New Book
        </Link>
      </div>
      
      {books.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600">No books found. Add your first book to get started!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Author</th>
                <th className="py-3 px-4 text-left">Year</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">{book.title}</td>
                  <td className="py-3 px-4">{book.author}</td>
                  <td className="py-3 px-4">{book.publishedYear}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <Link 
                        href={`/books/edit/${book._id}`} 
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(book._id)} 
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
