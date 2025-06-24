import { describe, test, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import request from "supertest";
import { createApp } from "../../app.js";
import { setupTestDB, teardownTestDB, clearTestDB, seedTestData } from "../helpers/database.js";
import { validBook, anotherValidBook, invalidBooks, booksArray } from "../fixtures/books.js";

describe("Books API Tests", () => {
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

   describe("POST /api/books", () => {
      test("should create a new book with valid data", async () => {
         const response = await request(app).post("/api/books").send(validBook).expect(201);

         expect(response.body).toHaveProperty("_id");
         expect(response.body.title).toBe(validBook.title);
         expect(response.body.author).toBe(validBook.author);
         expect(response.body.publishedYear).toBe(validBook.publishedYear);
      });

      test("should return 400 for missing title", async () => {
         const response = await request(app).post("/api/books").send(invalidBooks.missingTitle).expect(400);

         expect(response.body).toHaveProperty("error");
         expect(response.body.error).toContain("Title, author, and publishedYear are required");
      });

      test("should return 400 for missing author", async () => {
         const response = await request(app).post("/api/books").send(invalidBooks.missingAuthor).expect(400);

         expect(response.body).toHaveProperty("error");
         expect(response.body.error).toContain("Title, author, and publishedYear are required");
      });

      test("should return 400 for missing publishedYear", async () => {
         const response = await request(app).post("/api/books").send(invalidBooks.missingYear).expect(400);

         expect(response.body).toHaveProperty("error");
         expect(response.body.error).toContain("Title, author, and publishedYear are required");
      });

      test("should return 400 for invalid publishedYear type", async () => {
         const response = await request(app).post("/api/books").send(invalidBooks.invalidYear).expect(400);

         expect(response.body).toHaveProperty("error");
         expect(response.body.error).toContain("publishedYear must be a valid positive number");
      });

      test("should return 400 for negative publishedYear", async () => {
         const response = await request(app).post("/api/books").send(invalidBooks.negativeYear).expect(400);

         expect(response.body).toHaveProperty("error");
         expect(response.body.error).toContain("publishedYear must be a valid positive number");
      });

      test("should handle empty request body", async () => {
         const response = await request(app).post("/api/books").send({}).expect(400);

         expect(response.body).toHaveProperty("error");
      });

      test("should handle malformed JSON", async () => {
         const response = await request(app)
            .post("/api/books")
            .set("Content-Type", "application/json")
            .send("invalid json")
            .expect(400);
      });
   });

   describe("GET /api/books", () => {
      beforeEach(async () => {
         await seedTestData(booksArray);
      });

      test("should return all books", async () => {
         const response = await request(app).get("/api/books").expect(200);

         expect(Array.isArray(response.body)).toBe(true);
         expect(response.body).toHaveLength(booksArray.length);
      });

      test("should return empty array when no books exist", async () => {
         await clearTestDB();

         const response = await request(app).get("/api/books").expect(200);

         expect(Array.isArray(response.body)).toBe(true);
         expect(response.body).toHaveLength(0);
      });

      test("should filter books by author", async () => {
         const response = await request(app).get("/api/books?author=George Orwell").expect(200);

         expect(response.body).toHaveLength(2);
         response.body.forEach((book) => {
            expect(book.author).toMatch(/George Orwell/i);
         });
      });

      test("should filter books by year", async () => {
         const response = await request(app).get("/api/books?year=1949").expect(200);

         expect(response.body).toHaveLength(1);
         expect(response.body[0].publishedYear).toBe(1949);
         expect(response.body[0].title).toBe("1984");
      });

      test("should search books by title and author", async () => {
         const response = await request(app).get("/api/books?search=pride").expect(200);

         expect(response.body).toHaveLength(1);
         expect(response.body[0].title).toMatch(/pride/i);
      });

      test("should handle case-insensitive author search", async () => {
         const response = await request(app).get("/api/books?author=george orwell").expect(200);

         expect(response.body).toHaveLength(2);
      });

      test("should handle multiple filters", async () => {
         const response = await request(app).get("/api/books?author=George&year=1949").expect(200);

         expect(response.body).toHaveLength(1);
         expect(response.body[0].title).toBe("1984");
      });

      test("should return empty array for non-matching filters", async () => {
         const response = await request(app).get("/api/books?author=NonExistent").expect(200);

         expect(response.body).toHaveLength(0);
      });
   });

   describe("GET /api/books/:id", () => {
      let bookId;

      beforeEach(async () => {
         const response = await request(app).post("/api/books").send(validBook);
         bookId = response.body._id;
      });

      test("should return a book by valid ID", async () => {
         const response = await request(app).get(`/api/books/${bookId}`).expect(200);

         expect(response.body._id).toBe(bookId);
         expect(response.body.title).toBe(validBook.title);
         expect(response.body.author).toBe(validBook.author);
         expect(response.body.publishedYear).toBe(validBook.publishedYear);
      });

      test("should return 400 for invalid ID format", async () => {
         const response = await request(app).get("/api/books/invalid-id").expect(400);

         expect(response.body).toHaveProperty("error");
         expect(response.body.error).toContain("Invalid book ID format");
      });

      test("should return 404 for non-existent valid ID", async () => {
         const fakeId = "507f1f77bcf86cd799439011";
         const response = await request(app).get(`/api/books/${fakeId}`).expect(404);

         expect(response.body).toHaveProperty("error");
         expect(response.body.error).toBe("Book not found");
      });

      test("should handle empty ID parameter", async () => {
         const response = await request(app).get("/api/books/").expect(200); // This hits the GET /api/books endpoint

         expect(Array.isArray(response.body)).toBe(true);
      });
   });

   describe("PUT /api/books/:id", () => {
      let bookId;

      beforeEach(async () => {
         const response = await request(app).post("/api/books").send(validBook);
         bookId = response.body._id;
      });

      test("should update a book with valid data", async () => {
         const updateData = {
            title: "Updated Title",
            author: "Updated Author",
            publishedYear: 2023,
         };

         const response = await request(app).put(`/api/books/${bookId}`).send(updateData).expect(200);

         expect(response.body._id).toBe(bookId);
         expect(response.body.title).toBe(updateData.title);
         expect(response.body.author).toBe(updateData.author);
         expect(response.body.publishedYear).toBe(updateData.publishedYear);
      });

      test("should return 400 for invalid ID format", async () => {
         const response = await request(app).put("/api/books/invalid-id").send(validBook).expect(400);

         expect(response.body).toHaveProperty("error");
         expect(response.body.error).toContain("Invalid book ID format");
      });

      test("should return 404 for non-existent valid ID", async () => {
         const fakeId = "507f1f77bcf86cd799439011";
         const response = await request(app).put(`/api/books/${fakeId}`).send(validBook).expect(404);

         expect(response.body).toHaveProperty("error");
         expect(response.body.error).toBe("Book not found");
      });

      test("should return 400 for missing required fields", async () => {
         const response = await request(app).put(`/api/books/${bookId}`).send(invalidBooks.missingTitle).expect(400);

         expect(response.body).toHaveProperty("error");
         expect(response.body.error).toContain("Title, author, and publishedYear are required");
      });

      test("should return 400 for invalid publishedYear", async () => {
         const response = await request(app).put(`/api/books/${bookId}`).send(invalidBooks.invalidYear).expect(400);

         expect(response.body).toHaveProperty("error");
         expect(response.body.error).toContain("publishedYear must be a valid positive number");
      });

      test("should handle partial updates by requiring all fields", async () => {
         const partialUpdate = { title: "Only Title" };

         const response = await request(app).put(`/api/books/${bookId}`).send(partialUpdate).expect(400);

         expect(response.body).toHaveProperty("error");
      });
   });

   describe("DELETE /api/books/:id", () => {
      let bookId;

      beforeEach(async () => {
         const response = await request(app).post("/api/books").send(validBook);
         bookId = response.body._id;
      });

      test("should delete a book with valid ID", async () => {
         const response = await request(app).delete(`/api/books/${bookId}`).expect(200);

         expect(response.body).toHaveProperty("message");
         expect(response.body.message).toBe("Book deleted");
         expect(response.body).toHaveProperty("deletedBook");
         expect(response.body.deletedBook._id).toBe(bookId);

         // Verify book is deleted
         await request(app).get(`/api/books/${bookId}`).expect(404);
      });

      test("should return 400 for invalid ID format", async () => {
         const response = await request(app).delete("/api/books/invalid-id").expect(400);

         expect(response.body).toHaveProperty("error");
         expect(response.body.error).toContain("Invalid book ID format");
      });

      test("should return 404 for non-existent valid ID", async () => {
         const fakeId = "507f1f77bcf86cd799439011";
         const response = await request(app).delete(`/api/books/${fakeId}`).expect(404);

         expect(response.body).toHaveProperty("error");
         expect(response.body.error).toBe("Book not found");
      });

      test("should handle double deletion", async () => {
         // First deletion
         await request(app).delete(`/api/books/${bookId}`).expect(200);

         // Second deletion should return 404
         await request(app).delete(`/api/books/${bookId}`).expect(404);
      });
   });

   describe("GET /api/health", () => {
      test("should return health status", async () => {
         const response = await request(app).get("/api/health").expect(200);

         expect(response.body).toHaveProperty("status");
         expect(response.body.status).toBe("OK");
         expect(response.body).toHaveProperty("timestamp");
         expect(response.body).toHaveProperty("environment");
      });

      test("should return valid timestamp", async () => {
         const response = await request(app).get("/api/health").expect(200);

         const timestamp = new Date(response.body.timestamp);
         expect(timestamp).toBeInstanceOf(Date);
         expect(timestamp.getTime()).toBeLessThanOrEqual(Date.now());
      });
   });

   describe("Error Handling", () => {
      test("should handle 404 for non-existent routes", async () => {
         await request(app).get("/api/nonexistent").expect(404);
      });

      test("should handle invalid HTTP methods", async () => {
         await request(app).patch("/api/books").expect(404);
      });

      test("should handle large request bodies", async () => {
         const largeBook = {
            title: "x".repeat(10000),
            author: "y".repeat(10000),
            publishedYear: 2023,
         };

         const response = await request(app).post("/api/books").send(largeBook).expect(201);

         expect(response.body.title).toHaveLength(10000);
      });
   });

   describe("Content-Type Handling", () => {
      test("should handle JSON content-type", async () => {
         const response = await request(app)
            .post("/api/books")
            .set("Content-Type", "application/json")
            .send(JSON.stringify(validBook))
            .expect(201);

         expect(response.body.title).toBe(validBook.title);
      });

      test("should return proper content-type", async () => {
         const response = await request(app).get("/api/books").expect(200);

         expect(response.headers["content-type"]).toMatch(/application\/json/);
      });
   });

   describe("CORS Headers", () => {
      test("should include CORS headers", async () => {
         const response = await request(app).get("/api/books").expect(200);

         expect(response.headers["access-control-allow-origin"]).toBeDefined();
      });

      test("should handle OPTIONS request", async () => {
         await request(app).options("/api/books").expect(204);
      });
   });
});
