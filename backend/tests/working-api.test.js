import { describe, test, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import express from "express";
import cors from "cors";

// Simple book schema for testing
const bookSchema = new mongoose.Schema({
   title: { type: String, required: true },
   author: { type: String, required: true },
   publishedYear: { type: Number, required: true },
});

const Book = mongoose.model("Book", bookSchema);

// Create test app
const createTestApp = () => {
   const app = express();
   app.use(cors());
   app.use(express.json());

   // Get all books
   app.get("/api/books", async (req, res) => {
      try {
         const books = await Book.find();
         res.json(books);
      } catch (err) {
         res.status(500).json({ error: err.message });
      }
   });

   // Create a book
   app.post("/api/books", async (req, res) => {
      try {
         const { title, author, publishedYear } = req.body;

         if (!title || !author || !publishedYear) {
            return res.status(400).json({
               error: "Title, author, and publishedYear are required",
            });
         }

         const book = new Book({ title, author, publishedYear });
         await book.save();
         res.status(201).json(book);
      } catch (err) {
         res.status(400).json({ error: err.message });
      }
   });

   // Get book by ID
   app.get("/api/books/:id", async (req, res) => {
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
   });

   // Update book
   app.put("/api/books/:id", async (req, res) => {
      try {
         const { id } = req.params;
         const { title, author, publishedYear } = req.body;

         if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid book ID format" });
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
   });

   // Delete book
   app.delete("/api/books/:id", async (req, res) => {
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
   });

   return app;
};

let mongoServer;
let app;

describe("Books API Tests", () => {
   beforeAll(async () => {
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      app = createTestApp();
   });

   afterAll(async () => {
      if (mongoose.connection.readyState !== 0) {
         await mongoose.connection.dropDatabase();
         await mongoose.connection.close();
      }
      if (mongoServer) {
         await mongoServer.stop();
      }
   });

   beforeEach(async () => {
      const collections = mongoose.connection.collections;
      for (const key in collections) {
         const collection = collections[key];
         await collection.deleteMany({});
      }
   });

   describe("POST /api/books", () => {
      test("should create a new book", async () => {
         const bookData = {
            title: "Test Book",
            author: "Test Author",
            publishedYear: 2023,
         };

         const response = await request(app).post("/api/books").send(bookData).expect(201);

         expect(response.body).toHaveProperty("_id");
         expect(response.body.title).toBe(bookData.title);
         expect(response.body.author).toBe(bookData.author);
         expect(response.body.publishedYear).toBe(bookData.publishedYear);
      });

      test("should return 400 for missing fields", async () => {
         const invalidBook = {
            title: "Only Title",
         };

         const response = await request(app).post("/api/books").send(invalidBook).expect(400);

         expect(response.body).toHaveProperty("error");
         expect(response.body.error).toContain("Title, author, and publishedYear are required");
      });
   });

   describe("GET /api/books", () => {
      test("should return all books", async () => {
         // Create test books
         const books = [
            { title: "Book 1", author: "Author 1", publishedYear: 2020 },
            { title: "Book 2", author: "Author 2", publishedYear: 2021 },
         ];

         for (const book of books) {
            await request(app).post("/api/books").send(book);
         }

         const response = await request(app).get("/api/books").expect(200);

         expect(Array.isArray(response.body)).toBe(true);
         expect(response.body).toHaveLength(2);
      });

      test("should return empty array when no books", async () => {
         const response = await request(app).get("/api/books").expect(200);

         expect(Array.isArray(response.body)).toBe(true);
         expect(response.body).toHaveLength(0);
      });
   });

   describe("GET /api/books/:id", () => {
      test("should return a book by ID", async () => {
         const bookData = {
            title: "Single Book",
            author: "Single Author",
            publishedYear: 2022,
         };

         const createResponse = await request(app).post("/api/books").send(bookData);

         const bookId = createResponse.body._id;

         const response = await request(app).get(`/api/books/${bookId}`).expect(200);

         expect(response.body._id).toBe(bookId);
         expect(response.body.title).toBe(bookData.title);
      });

      test("should return 404 for non-existent book", async () => {
         const fakeId = "507f1f77bcf86cd799439011";

         await request(app).get(`/api/books/${fakeId}`).expect(404);
      });

      test("should return 400 for invalid ID format", async () => {
         await request(app).get("/api/books/invalid-id").expect(400);
      });
   });

   describe("PUT /api/books/:id", () => {
      test("should update a book", async () => {
         const originalData = {
            title: "Original Title",
            author: "Original Author",
            publishedYear: 2020,
         };

         const createResponse = await request(app).post("/api/books").send(originalData);

         const bookId = createResponse.body._id;

         const updateData = {
            title: "Updated Title",
            author: "Updated Author",
            publishedYear: 2023,
         };

         const response = await request(app).put(`/api/books/${bookId}`).send(updateData).expect(200);

         expect(response.body.title).toBe(updateData.title);
         expect(response.body.author).toBe(updateData.author);
         expect(response.body.publishedYear).toBe(updateData.publishedYear);
      });
   });

   describe("DELETE /api/books/:id", () => {
      test("should delete a book", async () => {
         const bookData = {
            title: "To Delete",
            author: "Delete Author",
            publishedYear: 2020,
         };

         const createResponse = await request(app).post("/api/books").send(bookData);

         const bookId = createResponse.body._id;

         const response = await request(app).delete(`/api/books/${bookId}`).expect(200);

         expect(response.body.message).toBe("Book deleted");

         // Verify book is deleted
         await request(app).get(`/api/books/${bookId}`).expect(404);
      });
   });
}, 30000);
