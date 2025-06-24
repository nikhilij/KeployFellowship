import express from "express";
import {
   createBook,
   getAllBooks,
   getBookById,
   updateBook,
   deleteBook,
   healthCheck,
} from "../controllers/bookController.js";

const router = express.Router();

// Book routes
router.post("/books", createBook);
router.get("/books", getAllBooks);
router.get("/books/:id", getBookById);
router.put("/books/:id", updateBook);
router.delete("/books/:id", deleteBook);

// Health check route
router.get("/health", healthCheck);

export default router;
