import { describe, test, expect, jest } from "@jest/globals";
import mongoose from "mongoose";

describe("Validation Utils Unit Tests", () => {
   describe("ObjectId Validation", () => {
      test("should validate correct ObjectId format", () => {
         const validId = new mongoose.Types.ObjectId();
         const validIdString = validId.toString();

         expect(mongoose.Types.ObjectId.isValid(validId)).toBe(true);
         expect(mongoose.Types.ObjectId.isValid(validIdString)).toBe(true);
      });

      test("should reject invalid ObjectId formats", () => {
         const invalidIds = [
            "invalid-id",
            "123",
            "",
            null,
            undefined,
            {},
            [],
            "too-short",
            "way-too-long-to-be-an-objectid-string",
         ];

         invalidIds.forEach((id) => {
            expect(mongoose.Types.ObjectId.isValid(id)).toBe(false);
         });
      });

      test("should handle edge cases", () => {
         expect(mongoose.Types.ObjectId.isValid("000000000000000000000000")).toBe(true);
         expect(mongoose.Types.ObjectId.isValid("aaaaaaaaaaaaaaaaaaaaaaaa")).toBe(true);
         expect(mongoose.Types.ObjectId.isValid("AAAAAAAAAAAAAAAAAAAAAAAA")).toBe(true);
      });
   });

   describe("Input Validation Helpers", () => {
      const validateBookInput = (data) => {
         const errors = [];

         if (!data.title || typeof data.title !== "string" || data.title.trim() === "") {
            errors.push("Title is required and must be a non-empty string");
         }

         if (!data.author || typeof data.author !== "string" || data.author.trim() === "") {
            errors.push("Author is required and must be a non-empty string");
         }

         if (!data.publishedYear || typeof data.publishedYear !== "number" || data.publishedYear < 0) {
            errors.push("Published year must be a valid positive number");
         }

         return errors;
      };

      test("should validate correct book input", () => {
         const validInput = {
            title: "Test Book",
            author: "Test Author",
            publishedYear: 2023,
         };

         const errors = validateBookInput(validInput);
         expect(errors).toHaveLength(0);
      });

      test("should detect missing title", () => {
         const invalidInput = {
            author: "Test Author",
            publishedYear: 2023,
         };

         const errors = validateBookInput(invalidInput);
         expect(errors).toContain("Title is required and must be a non-empty string");
      });

      test("should detect empty title", () => {
         const invalidInput = {
            title: "   ",
            author: "Test Author",
            publishedYear: 2023,
         };

         const errors = validateBookInput(invalidInput);
         expect(errors).toContain("Title is required and must be a non-empty string");
      });

      test("should detect missing author", () => {
         const invalidInput = {
            title: "Test Book",
            publishedYear: 2023,
         };

         const errors = validateBookInput(invalidInput);
         expect(errors).toContain("Author is required and must be a non-empty string");
      });

      test("should detect invalid published year", () => {
         const invalidInputs = [
            {
               title: "Test Book",
               author: "Test Author",
               publishedYear: "not a number",
            },
            {
               title: "Test Book",
               author: "Test Author",
               publishedYear: -100,
            },
            {
               title: "Test Book",
               author: "Test Author",
            },
         ];

         invalidInputs.forEach((input) => {
            const errors = validateBookInput(input);
            expect(errors).toContain("Published year must be a valid positive number");
         });
      });

      test("should detect multiple validation errors", () => {
         const invalidInput = {
            title: "",
            publishedYear: "invalid",
         };

         const errors = validateBookInput(invalidInput);
         expect(errors).toHaveLength(3);
         expect(errors).toContain("Title is required and must be a non-empty string");
         expect(errors).toContain("Author is required and must be a non-empty string");
         expect(errors).toContain("Published year must be a valid positive number");
      });
   });

   describe("Query Helper Functions", () => {
      const buildSearchQuery = (filters) => {
         const query = {};

         if (filters.author) {
            query.author = { $regex: filters.author, $options: "i" };
         }

         if (filters.year) {
            query.publishedYear = parseInt(filters.year);
         }

         if (filters.search) {
            query.$or = [
               { title: { $regex: filters.search, $options: "i" } },
               { author: { $regex: filters.search, $options: "i" } },
            ];
         }

         return query;
      };

      test("should build query with author filter", () => {
         const filters = { author: "Orwell" };
         const query = buildSearchQuery(filters);

         expect(query.author).toEqual({ $regex: "Orwell", $options: "i" });
      });

      test("should build query with year filter", () => {
         const filters = { year: "1984" };
         const query = buildSearchQuery(filters);

         expect(query.publishedYear).toBe(1984);
      });

      test("should build query with search filter", () => {
         const filters = { search: "gatsby" };
         const query = buildSearchQuery(filters);

         expect(query.$or).toEqual([
            { title: { $regex: "gatsby", $options: "i" } },
            { author: { $regex: "gatsby", $options: "i" } },
         ]);
      });

      test("should build empty query with no filters", () => {
         const filters = {};
         const query = buildSearchQuery(filters);

         expect(Object.keys(query)).toHaveLength(0);
      });

      test("should build complex query with multiple filters", () => {
         const filters = { author: "Orwell", year: "1984", search: "dystopia" };
         const query = buildSearchQuery(filters);

         expect(query.author).toEqual({ $regex: "Orwell", $options: "i" });
         expect(query.publishedYear).toBe(1984);
         expect(query.$or).toBeDefined();
      });
   });

   describe("Error Handling Utilities", () => {
      const createErrorResponse = (message, statusCode = 400) => {
         return {
            error: message,
            statusCode,
            timestamp: new Date().toISOString(),
         };
      };

      test("should create error response with default status code", () => {
         const error = createErrorResponse("Test error");

         expect(error.error).toBe("Test error");
         expect(error.statusCode).toBe(400);
         expect(error.timestamp).toBeDefined();
      });

      test("should create error response with custom status code", () => {
         const error = createErrorResponse("Not found", 404);

         expect(error.error).toBe("Not found");
         expect(error.statusCode).toBe(404);
      });

      test("should include timestamp in error response", () => {
         const error = createErrorResponse("Test error");
         const timestamp = new Date(error.timestamp);

         expect(timestamp).toBeInstanceOf(Date);
         expect(timestamp.getTime()).toBeLessThanOrEqual(Date.now());
      });
   });
});
