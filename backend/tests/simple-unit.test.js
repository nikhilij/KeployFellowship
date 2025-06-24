import { describe, test, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import mongoose from "mongoose";
import { Book } from "../src/models/Book.js";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;

describe("Book Model Unit Tests", () => {
   beforeAll(async () => {
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
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

   test("should create a valid book", async () => {
      const bookData = {
         title: "The Great Gatsby",
         author: "F. Scott Fitzgerald",
         publishedYear: 1925,
      };

      const book = new Book(bookData);
      const savedBook = await book.save();

      expect(savedBook._id).toBeDefined();
      expect(savedBook.title).toBe(bookData.title);
      expect(savedBook.author).toBe(bookData.author);
      expect(savedBook.publishedYear).toBe(bookData.publishedYear);
   });

   test("should fail to create book without title", async () => {
      const bookData = {
         author: "Test Author",
         publishedYear: 2023,
      };

      const book = new Book(bookData);

      await expect(book.save()).rejects.toThrow("Path `title` is required");
   });

   test("should fail to create book without author", async () => {
      const bookData = {
         title: "Test Title",
         publishedYear: 2023,
      };

      const book = new Book(bookData);

      await expect(book.save()).rejects.toThrow("Path `author` is required");
   });

   test("should fail to create book without publishedYear", async () => {
      const bookData = {
         title: "Test Title",
         author: "Test Author",
      };

      const book = new Book(bookData);

      await expect(book.save()).rejects.toThrow("Path `publishedYear` is required");
   });

   test("should find all books", async () => {
      const books = [
         { title: "Book 1", author: "Author 1", publishedYear: 2020 },
         { title: "Book 2", author: "Author 2", publishedYear: 2021 },
      ];

      await Book.insertMany(books);

      const foundBooks = await Book.find();
      expect(foundBooks).toHaveLength(2);
   });

   test("should update a book", async () => {
      const book = await Book.create({
         title: "Original Title",
         author: "Original Author",
         publishedYear: 2000,
      });

      const updatedBook = await Book.findByIdAndUpdate(book._id, { title: "Updated Title" }, { new: true });

      expect(updatedBook.title).toBe("Updated Title");
      expect(updatedBook.author).toBe("Original Author");
   });

   test("should delete a book", async () => {
      const book = await Book.create({
         title: "To Delete",
         author: "Delete Author",
         publishedYear: 2000,
      });

      const deletedBook = await Book.findByIdAndDelete(book._id);
      expect(deletedBook).toBeTruthy();

      const notFound = await Book.findById(book._id);
      expect(notFound).toBeNull();
   });
}, 30000);
