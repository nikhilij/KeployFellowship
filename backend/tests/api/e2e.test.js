import { describe, test, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import request from "supertest";
import { createApp } from "../../app.js";
import { setupTestDB, teardownTestDB, clearTestDB } from "../helpers/database.js";
import { validBook, anotherValidBook } from "../fixtures/books.js";

describe("End-to-End API Workflow Tests", () => {
   let app;

   beforeAll(async () => {
      await setupTestDB();
      app = createApp();
   });

   afterAll(async () => {
      await teardownTestDB();
   });

   beforeEach(async () => {
      await clearTestDB();
   });

   describe("Complete Book Management Workflow", () => {
      test("should handle complete book CRUD workflow", async () => {
         // 1. Start with empty database
         let response = await request(app).get("/api/books").expect(200);
         expect(response.body).toHaveLength(0);

         // 2. Create first book
         response = await request(app).post("/api/books").send(validBook).expect(201);

         const book1Id = response.body._id;
         expect(response.body.title).toBe(validBook.title);

         // 3. Create second book
         response = await request(app).post("/api/books").send(anotherValidBook).expect(201);

         const book2Id = response.body._id;

         // 4. Verify both books exist
         response = await request(app).get("/api/books").expect(200);
         expect(response.body).toHaveLength(2);

         // 5. Get specific book
         response = await request(app).get(`/api/books/${book1Id}`).expect(200);
         expect(response.body.title).toBe(validBook.title);

         // 6. Update first book
         const updateData = {
            title: "Updated Title",
            author: "Updated Author",
            publishedYear: 2023,
         };

         response = await request(app).put(`/api/books/${book1Id}`).send(updateData).expect(200);
         expect(response.body.title).toBe(updateData.title);

         // 7. Verify update
         response = await request(app).get(`/api/books/${book1Id}`).expect(200);
         expect(response.body.title).toBe(updateData.title);

         // 8. Search for updated book
         response = await request(app).get("/api/books?search=Updated").expect(200);
         expect(response.body).toHaveLength(1);
         expect(response.body[0].title).toBe(updateData.title);

         // 9. Delete first book
         response = await request(app).delete(`/api/books/${book1Id}`).expect(200);
         expect(response.body.message).toBe("Book deleted");

         // 10. Verify deletion
         response = await request(app).get(`/api/books/${book1Id}`).expect(404);

         // 11. Verify only one book remains
         response = await request(app).get("/api/books").expect(200);
         expect(response.body).toHaveLength(1);
         expect(response.body[0]._id).toBe(book2Id);

         // 12. Delete remaining book
         await request(app).delete(`/api/books/${book2Id}`).expect(200);

         // 13. Verify empty database
         response = await request(app).get("/api/books").expect(200);
         expect(response.body).toHaveLength(0);
      });

      test("should handle error scenarios in workflow", async () => {
         // 1. Try to get non-existent book
         await request(app).get("/api/books/507f1f77bcf86cd799439011").expect(404);

         // 2. Try to create book with invalid data
         await request(app).post("/api/books").send({ title: "Only Title" }).expect(400);

         // 3. Create valid book
         const response = await request(app).post("/api/books").send(validBook).expect(201);

         const bookId = response.body._id;

         // 4. Try to update with invalid data
         await request(app).put(`/api/books/${bookId}`).send({ title: "Only Title" }).expect(400);

         // 5. Try to update non-existent book
         await request(app).put("/api/books/507f1f77bcf86cd799439011").send(validBook).expect(404);

         // 6. Try to delete non-existent book
         await request(app).delete("/api/books/507f1f77bcf86cd799439011").expect(404);

         // 7. Delete existing book
         await request(app).delete(`/api/books/${bookId}`).expect(200);

         // 8. Try to delete same book again
         await request(app).delete(`/api/books/${bookId}`).expect(404);
      });
   });

   describe("Multiple Books Management", () => {
      test("should handle multiple books with same author", async () => {
         const orwellBooks = [
            { title: "1984", author: "George Orwell", publishedYear: 1949 },
            { title: "Animal Farm", author: "George Orwell", publishedYear: 1945 },
            { title: "Homage to Catalonia", author: "George Orwell", publishedYear: 1938 },
         ];

         const bookIds = [];

         // Create all books
         for (const book of orwellBooks) {
            const response = await request(app).post("/api/books").send(book).expect(201);
            bookIds.push(response.body._id);
         }

         // Search by author
         let response = await request(app).get("/api/books?author=George Orwell").expect(200);
         expect(response.body).toHaveLength(3);

         // Search by specific year
         response = await request(app).get("/api/books?year=1949").expect(200);
         expect(response.body).toHaveLength(1);
         expect(response.body[0].title).toBe("1984");

         // Search by title
         response = await request(app).get("/api/books?search=Animal").expect(200);
         expect(response.body).toHaveLength(1);
         expect(response.body[0].title).toBe("Animal Farm");

         // Update one book
         const updateData = {
            title: "1984 (Updated Edition)",
            author: "George Orwell",
            publishedYear: 1949,
         };

         await request(app).put(`/api/books/${bookIds[0]}`).send(updateData).expect(200);

         // Verify update
         response = await request(app).get(`/api/books/${bookIds[0]}`).expect(200);
         expect(response.body.title).toBe("1984 (Updated Edition)");

         // Delete all books
         for (const bookId of bookIds) {
            await request(app).delete(`/api/books/${bookId}`).expect(200);
         }

         // Verify all deleted
         response = await request(app).get("/api/books").expect(200);
         expect(response.body).toHaveLength(0);
      });
   });

   describe("Search and Filter Workflows", () => {
      const testBooks = [
         { title: "The Great Gatsby", author: "F. Scott Fitzgerald", publishedYear: 1925 },
         { title: "To Kill a Mockingbird", author: "Harper Lee", publishedYear: 1960 },
         { title: "Pride and Prejudice", author: "Jane Austen", publishedYear: 1813 },
         { title: "The Catcher in the Rye", author: "J.D. Salinger", publishedYear: 1951 },
         { title: "Great Expectations", author: "Charles Dickens", publishedYear: 1861 },
      ];

      beforeEach(async () => {
         // Create test books
         for (const book of testBooks) {
            await request(app).post("/api/books").send(book).expect(201);
         }
      });

      test("should perform various search operations", async () => {
         // Search by partial title
         let response = await request(app).get("/api/books?search=Great").expect(200);
         expect(response.body).toHaveLength(2);

         // Search by author (case insensitive)
         response = await request(app).get("/api/books?author=jane austen").expect(200);
         expect(response.body).toHaveLength(1);
         expect(response.body[0].author).toBe("Jane Austen");

         // Filter by year
         response = await request(app).get("/api/books?year=1925").expect(200);
         expect(response.body).toHaveLength(1);
         expect(response.body[0].title).toBe("The Great Gatsby");

         // Combined search
         response = await request(app).get("/api/books?search=the&author=harper").expect(200);
         expect(response.body).toHaveLength(0); // No books match both criteria

         // No results
         response = await request(app).get("/api/books?author=NonExistent").expect(200);
         expect(response.body).toHaveLength(0);
      });
   });

   describe("Error Recovery Workflows", () => {
      test("should recover from validation errors", async () => {
         // Try invalid creation
         await request(app).post("/api/books").send({ title: "Only Title" }).expect(400);

         // Fix and create successfully
         const response = await request(app).post("/api/books").send(validBook).expect(201);

         const bookId = response.body._id;

         // Try invalid update
         await request(app).put(`/api/books/${bookId}`).send({ publishedYear: "invalid" }).expect(400);

         // Fix and update successfully
         const updateData = {
            title: "Updated Title",
            author: "Updated Author",
            publishedYear: 2023,
         };

         await request(app).put(`/api/books/${bookId}`).send(updateData).expect(200);

         // Verify update worked
         const verifyResponse = await request(app).get(`/api/books/${bookId}`).expect(200);
         expect(verifyResponse.body.title).toBe(updateData.title);
      });
   });

   describe("API Health and Status", () => {
      test("should maintain health status throughout operations", async () => {
         // Check initial health
         let response = await request(app).get("/api/health").expect(200);
         expect(response.body.status).toBe("OK");

         // Perform operations
         const createResponse = await request(app).post("/api/books").send(validBook).expect(201);

         const bookId = createResponse.body._id;

         // Check health after operations
         response = await request(app).get("/api/health").expect(200);
         expect(response.body.status).toBe("OK");

         // Clean up
         await request(app).delete(`/api/books/${bookId}`).expect(200);

         // Final health check
         response = await request(app).get("/api/health").expect(200);
         expect(response.body.status).toBe("OK");
      });
   });
});
