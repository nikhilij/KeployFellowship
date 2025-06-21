// API utility functions for communicating with the backend

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const fetchBooks = async () => {
  try {
    const response = await fetch(`${API_URL}/api/books`);
    if (!response.ok) throw new Error('Failed to fetch books');
    return await response.json();
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

export const getBook = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/books/${id}`);
    if (!response.ok) throw new Error('Failed to fetch book');
    return await response.json();
  } catch (error) {
    console.error('Error fetching book:', error);
    throw error;
  }
};

export const createBook = async (bookData) => {
  try {
    const response = await fetch(`${API_URL}/api/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
    });
    if (!response.ok) throw new Error('Failed to create book');
    return await response.json();
  } catch (error) {
    console.error('Error creating book:', error);
    throw error;
  }
};

export const updateBook = async (id, bookData) => {
  try {
    const response = await fetch(`${API_URL}/api/books/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
    });
    if (!response.ok) throw new Error('Failed to update book');
    return await response.json();
  } catch (error) {
    console.error('Error updating book:', error);
    throw error;
  }
};

export const deleteBook = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/books/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete book');
    return await response.json();
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
};
