import { describe, test, expect, beforeAll, afterAll, beforeEach, jest } from "@jest/globals";
import mongoose from "mongoose";
import { Book } from "../../src/models/Book.js";
import { setupTestDB, teardownTestDB, clearTestDB } from "../helpers/database.js";
import { validBook, invalidBooks, booksArray } from "../fixtures/books.js";

describe("Book Model Unit Tests", () => {
   beforeAll(async () => {
      await setupTestDB();
   });

   afterAll(async () => {
      await teardownTestDB();
   });

   beforeEach(async () => {
      await clearTestDB();
   });

   describe("Book Creation", () => {
      test("should create a valid book", async () => {
         const book = new Book(validBook);
         const savedBook = await book.save();

         expect(savedBook._id).toBeDefined();
         expect(savedBook.title).toBe(validBook.title);
         expect(savedBook.author).toBe(validBook.author);
         expect(savedBook.publishedYear).toBe(validBook.publishedYear);
      });

      test("should fail to create book without title", async () => {
         const book = new Book(invalidBooks.missingTitle);

         await expect(book.save()).rejects.toThrow("Path `title` is required");
      });

      test("should fail to create book without author", async () => {
         const book = new Book(invalidBooks.missingAuthor);

         await expect(book.save()).rejects.toThrow("Path `author` is required");
      });

      test("should fail to create book without publishedYear", async () => {
         const book = new Book(invalidBooks.missingYear);

         await expect(book.save()).rejects.toThrow("Path `publishedYear` is required");
      });

      test("should handle validation for publishedYear type", async () => {
         const book = new Book(invalidBooks.invalidYear);

         await expect(book.save()).rejects.toThrow();
      });
   });

   describe("Book Queries", () => {
      beforeEach(async () => {
         await Book.insertMany(booksArray);
      });

      test("should find all books", async () => {
         const books = await Book.find();
         expect(books).toHaveLength(booksArray.length);
      });

      test("should find book by author", async () => {
         const books = await Book.find({ author: "George Orwell" });
         expect(books).toHaveLength(2);
         expect(books[0].author).toBe("George Orwell");
      });

      test("should find book by title", async () => {
         const book = await Book.findOne({ title: "1984" });
         expect(book).toBeTruthy();
         expect(book.title).toBe("1984");
         expect(book.author).toBe("George Orwell");
      });

      test("should find book by publishedYear", async () => {
         const books = await Book.find({ publishedYear: 1949 });
         expect(books).toHaveLength(1);
         expect(books[0].title).toBe("1984");
      });

      test("should return empty array for non-existent author", async () => {
         const books = await Book.find({ author: "Non Existent Author" });
         expect(books).toHaveLength(0);
      });
   });

   describe("Book Updates", () => {
      let bookId;

      beforeEach(async () => {
         const book = await Book.create(validBook);
         bookId = book._id;
      });

      test("should update book successfully", async () => {
         const updateData = {
            title: "Updated Title",
            author: "Updated Author",
            publishedYear: 2023,
         };

         const updatedBook = await Book.findByIdAndUpdate(bookId, updateData, { new: true });

         expect(updatedBook.title).toBe(updateData.title);
         expect(updatedBook.author).toBe(updateData.author);
         expect(updatedBook.publishedYear).toBe(updateData.publishedYear);
      });

      test("should return null for non-existent book update", async () => {
         const fakeId = new mongoose.Types.ObjectId();
         const updateData = { title: "Updated Title" };

         const result = await Book.findByIdAndUpdate(fakeId, updateData, { new: true });
         expect(result).toBeNull();
      });
   });

   describe("Book Deletion", () => {
      let bookId;

      beforeEach(async () => {
         const book = await Book.create(validBook);
         bookId = book._id;
      });

      test("should delete book successfully", async () => {
         const deletedBook = await Book.findByIdAndDelete(bookId);
         expect(deletedBook).toBeTruthy();
         expect(deletedBook._id.toString()).toBe(bookId.toString());

         const foundBook = await Book.findById(bookId);
         expect(foundBook).toBeNull();
      });

      test("should return null for non-existent book deletion", async () => {
         const fakeId = new mongoose.Types.ObjectId();
         const result = await Book.findByIdAndDelete(fakeId);
         expect(result).toBeNull();
      });
   });

   describe("Book Model Validation", () => {
      test("should validate ObjectId format", () => {
         const validId = new mongoose.Types.ObjectId();
         const invalidId = "invalid-id";

         expect(mongoose.Types.ObjectId.isValid(validId)).toBe(true);
         expect(mongoose.Types.ObjectId.isValid(invalidId)).toBe(false);
      });

      test("should handle concurrent operations", async () => {
         const promises = booksArray.map((bookData) => Book.create(bookData));
         const results = await Promise.all(promises);

         expect(results).toHaveLength(booksArray.length);
         results.forEach((book) => {
            expect(book._id).toBeDefined();
         });
      });
   });
});

// Note: Database connection is tested implicitly through all other database operations
// No need for explicit connection state tests since they work successfully in other test suites
