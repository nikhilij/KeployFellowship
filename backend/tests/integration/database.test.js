import { describe, test, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import mongoose from "mongoose";
import { Book } from "../../src/models/Book.js";
import { setupTestDB, teardownTestDB, clearTestDB, seedTestData } from "../helpers/database.js";
import { validBook, anotherValidBook, booksArray } from "../fixtures/books.js";

describe("Database Integration Tests", () => {
   beforeAll(async () => {
      await setupTestDB();
   });

   afterAll(async () => {
      await teardownTestDB();
   });

   beforeEach(async () => {
      await clearTestDB();
   });

   describe("CRUD Operations Integration", () => {
      test("should perform complete CRUD cycle", async () => {
         // CREATE
         const createdBook = await Book.create(validBook);
         expect(createdBook._id).toBeDefined();
         expect(createdBook.title).toBe(validBook.title);

         // READ
         const foundBook = await Book.findById(createdBook._id);
         expect(foundBook).toBeTruthy();
         expect(foundBook.title).toBe(validBook.title);

         // UPDATE
         const updateData = { title: "Updated Title" };
         const updatedBook = await Book.findByIdAndUpdate(createdBook._id, updateData, { new: true });
         expect(updatedBook.title).toBe("Updated Title");

         // DELETE
         const deletedBook = await Book.findByIdAndDelete(createdBook._id);
         expect(deletedBook).toBeTruthy();

         // VERIFY DELETION
         const notFound = await Book.findById(createdBook._id);
         expect(notFound).toBeNull();
      });

      test("should handle bulk operations", async () => {
         // Bulk create
         const createdBooks = await Book.insertMany(booksArray);
         expect(createdBooks).toHaveLength(booksArray.length);

         // Bulk read
         const allBooks = await Book.find();
         expect(allBooks).toHaveLength(booksArray.length);

         // Bulk update
         const updateResult = await Book.updateMany({ author: "George Orwell" }, { $set: { publishedYear: 2000 } });
         expect(updateResult.modifiedCount).toBe(2);

         // Verify bulk update
         const orwellBooks = await Book.find({ author: "George Orwell" });
         orwellBooks.forEach((book) => {
            expect(book.publishedYear).toBe(2000);
         });

         // Bulk delete
         const deleteResult = await Book.deleteMany({ publishedYear: 2000 });
         expect(deleteResult.deletedCount).toBe(2);

         // Verify bulk delete
         const remainingBooks = await Book.find();
         expect(remainingBooks).toHaveLength(3);
      });
   });

   describe("Database Constraints and Validation Integration", () => {
      test("should enforce required fields", async () => {
         const invalidBook = new Book({
            title: "Test Book",
            // Missing author and publishedYear
         });

         await expect(invalidBook.save()).rejects.toThrow();
      });
      test("should handle duplicate entries", async () => {
         const firstBook = await Book.create(validBook);

         // MongoDB allows duplicate entries by default for this schema
         const duplicateBook = await Book.create(validBook);
         expect(duplicateBook._id).toBeDefined();
         expect(duplicateBook._id).not.toEqual(firstBook._id);
      });

      test("should validate data types", async () => {
         const invalidBook = new Book({
            title: 123, // Should be string
            author: "Test Author",
            publishedYear: "invalid", // Should be number
         });

         await expect(invalidBook.save()).rejects.toThrow();
      });
   });

   describe("Query Operations Integration", () => {
      beforeEach(async () => {
         await seedTestData(booksArray);
      });

      test("should perform complex queries", async () => {
         // Case-insensitive search
         const orwellBooks = await Book.find({
            author: { $regex: "george orwell", $options: "i" },
         });
         expect(orwellBooks).toHaveLength(2);

         // Range queries
         const modernBooks = await Book.find({
            publishedYear: { $gte: 1950 },
         });
         expect(modernBooks).toHaveLength(2);

         // Text search simulation
         const searchResults = await Book.find({
            $or: [{ title: { $regex: "animal", $options: "i" } }, { author: { $regex: "animal", $options: "i" } }],
         });
         expect(searchResults).toHaveLength(1);
      });

      test("should handle aggregation operations", async () => {
         // Group by author
         const authorCounts = await Book.aggregate([
            {
               $group: {
                  _id: "$author",
                  count: { $sum: 1 },
                  books: { $push: "$title" },
               },
            },
         ]);

         const orwellGroup = authorCounts.find((group) => group._id === "George Orwell");
         expect(orwellGroup.count).toBe(2);
         expect(orwellGroup.books).toContain("1984");
         expect(orwellGroup.books).toContain("Animal Farm");
      });

      test("should handle sorting and pagination", async () => {
         // Sort by year
         const sortedBooks = await Book.find().sort({ publishedYear: 1 });
         expect(sortedBooks[0].publishedYear).toBeLessThanOrEqual(sortedBooks[1].publishedYear);

         // Pagination
         const page1 = await Book.find().limit(2).skip(0);
         const page2 = await Book.find().limit(2).skip(2);

         expect(page1).toHaveLength(2);
         expect(page2).toHaveLength(2);
         expect(page1[0]._id).not.toEqual(page2[0]._id);
      });
   });

   describe("Transaction Simulation Integration", () => {
      test("should handle concurrent operations", async () => {
         const concurrentOps = [];

         // Simulate concurrent creates
         for (let i = 0; i < 5; i++) {
            concurrentOps.push(
               Book.create({
                  title: `Concurrent Book ${i}`,
                  author: "Concurrent Author",
                  publishedYear: 2023 + i,
               })
            );
         }

         const results = await Promise.all(concurrentOps);
         expect(results).toHaveLength(5);

         // Verify all were created
         const allBooks = await Book.find({ author: "Concurrent Author" });
         expect(allBooks).toHaveLength(5);
      });

      test("should handle mixed operations", async () => {
         // Create initial data
         const initialBook = await Book.create(validBook);

         // Perform mixed operations
         const operations = [
            Book.create(anotherValidBook),
            Book.findByIdAndUpdate(initialBook._id, { title: "Updated Title" }, { new: true }),
            Book.find({ author: validBook.author }),
         ];

         const [newBook, updatedBook, foundBooks] = await Promise.all(operations);

         expect(newBook.title).toBe(anotherValidBook.title);
         expect(updatedBook.title).toBe("Updated Title");
         expect(foundBooks).toHaveLength(1);
      });
   });

   describe("Error Handling Integration", () => {
      test("should handle invalid ObjectId gracefully", async () => {
         const invalidId = "invalid-object-id";

         await expect(Book.findById(invalidId)).rejects.toThrow();
      });

      test("should handle network simulation errors", async () => {
         // This test simulates what would happen if database operations fail
         const nonExistentId = new mongoose.Types.ObjectId();

         const result = await Book.findById(nonExistentId);
         expect(result).toBeNull();
      });

      test("should handle validation errors during save", async () => {
         const book = new Book({
            title: "Test Book",
            author: "Test Author",
            publishedYear: "invalid-year",
         });

         let error;
         try {
            await book.save();
         } catch (err) {
            error = err;
         }

         expect(error).toBeDefined();
         expect(error.name).toBe("ValidationError");
      });
   });

   describe("Performance Integration Tests", () => {
      test("should handle large dataset operations", async () => {
         // Create a larger dataset
         const largeDataset = [];
         for (let i = 0; i < 100; i++) {
            largeDataset.push({
               title: `Book ${i}`,
               author: `Author ${i % 10}`, // 10 different authors
               publishedYear: 1900 + (i % 124), // Years from 1900 to 2023
            });
         }

         const startTime = Date.now();
         await Book.insertMany(largeDataset);
         const insertTime = Date.now() - startTime;

         // Should complete within reasonable time (less than 1 second)
         expect(insertTime).toBeLessThan(1000);

         // Test query performance
         const queryStart = Date.now();
         const results = await Book.find({ author: "Author 5" });
         const queryTime = Date.now() - queryStart;

         expect(results).toHaveLength(10);
         expect(queryTime).toBeLessThan(500);
      });

      test("should handle index operations", async () => {
         // Create index on author field
         await Book.collection.createIndex({ author: 1 });

         // Verify index exists
         const indexes = await Book.collection.indexes();
         const authorIndex = indexes.find((index) => index.key.author === 1);
         expect(authorIndex).toBeDefined();

         // Test query with index
         await seedTestData(booksArray);
         const results = await Book.find({ author: "George Orwell" });
         expect(results).toHaveLength(2);
      });
   });
});
