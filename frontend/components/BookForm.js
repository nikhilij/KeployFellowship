'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { createBook, updateBook } from '../lib/api';

export default function BookForm({ book = null }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    defaultValues: {
      title: book?.title || '',
      author: book?.author || '',
      publishedYear: book?.publishedYear || new Date().getFullYear()
    }
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (book && book._id) {
        await updateBook(book._id, data);
      } else {
        await createBook(data);
      }
      
      router.push('/');
      router.refresh();
    } catch (err) {
      setError('Failed to save the book. Please try again.');
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <h1 className="text-2xl font-bold mb-6">
        {book ? 'Edit Book' : 'Add New Book'}
      </h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
            Book Title
          </label>
          <input
            id="title"
            type="text"
            className={`w-full px-3 py-2 border rounded-md ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter book title"
            {...register('title', { required: 'Title is required' })}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="author">
            Author
          </label>
          <input
            id="author"
            type="text"
            className={`w-full px-3 py-2 border rounded-md ${
              errors.author ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter author name"
            {...register('author', { required: 'Author is required' })}
          />
          {errors.author && (
            <p className="mt-1 text-sm text-red-600">{errors.author.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="publishedYear">
            Published Year
          </label>
          <input
            id="publishedYear"
            type="number"
            className={`w-full px-3 py-2 border rounded-md ${
              errors.publishedYear ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('publishedYear', { 
              required: 'Published year is required',
              min: { 
                value: 1000, 
                message: 'Year must be 1000 or later' 
              },
              max: { 
                value: new Date().getFullYear(), 
                message: `Year cannot be in the future` 
              }
            })}
          />
          {errors.publishedYear && (
            <p className="mt-1 text-sm text-red-600">{errors.publishedYear.message}</p>
          )}
        </div>
        
        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isSubmitting ? 'Saving...' : book ? 'Update Book' : 'Add Book'}
          </button>
          
          <button
            type="button"
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
