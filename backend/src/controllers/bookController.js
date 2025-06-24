import mongoose from "mongoose";
import { Book } from "../models/Book.js";

// Create a book
export const createBook = async (req, res) => {
   try {
      const { title, author, publishedYear } = req.body;

      // Validation
      if (!title || !author || !publishedYear) {
         return res.status(400).json({
            error: "Title, author, and publishedYear are required",
         });
      }

      if (typeof publishedYear !== "number" || publishedYear < 0) {
         return res.status(400).json({
            error: "publishedYear must be a valid positive number",
         });
      }

      const book = new Book({ title, author, publishedYear });
      await book.save();
      res.status(201).json(book);
   } catch (err) {
      res.status(400).json({ error: err.message });
   }
};

// Get all books with optional filtering
export const getAllBooks = async (req, res) => {
   try {
      const { author, year, search } = req.query;
      let query = {};

      if (author) {
         query.author = { $regex: author, $options: "i" };
      }

      if (year) {
         query.publishedYear = parseInt(year);
      }

      if (search) {
         query.$or = [{ title: { $regex: search, $options: "i" } }, { author: { $regex: search, $options: "i" } }];
      }

      const books = await Book.find(query);
      res.json(books);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
};

// Get a single book by ID
export const getBookById = async (req, res) => {
   try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
         return res.status(400).json({ error: "Invalid book ID format" });
      }

      const book = await Book.findById(id);
      if (!book) return res.status(404).json({ error: "Book not found" });
      res.json(book);
   } catch (err) {
      res.status(400).json({ error: err.message });
   }
};

// Update a book
export const updateBook = async (req, res) => {
   try {
      const { id } = req.params;
      const { title, author, publishedYear } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
         return res.status(400).json({ error: "Invalid book ID format" });
      }

      // Validation
      if (!title || !author || !publishedYear) {
         return res.status(400).json({
            error: "Title, author, and publishedYear are required",
         });
      }

      if (typeof publishedYear !== "number" || publishedYear < 0) {
         return res.status(400).json({
            error: "publishedYear must be a valid positive number",
         });
      }

      const book = await Book.findByIdAndUpdate(
         id,
         { title, author, publishedYear },
         { new: true, runValidators: true }
      );

      if (!book) return res.status(404).json({ error: "Book not found" });
      res.json(book);
   } catch (err) {
      res.status(400).json({ error: err.message });
   }
};

// Delete a book
export const deleteBook = async (req, res) => {
   try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
         return res.status(400).json({ error: "Invalid book ID format" });
      }

      const book = await Book.findByIdAndDelete(id);
      if (!book) return res.status(404).json({ error: "Book not found" });
      res.json({ message: "Book deleted", deletedBook: book });
   } catch (err) {
      res.status(400).json({ error: err.message });
   }
};

// Health check endpoint
export const healthCheck = (req, res) => {
   res.json({
      status: "OK",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
   });
};
