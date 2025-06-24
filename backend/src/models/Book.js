import mongoose from "mongoose";

// Book Schema & Model
const bookSchema = new mongoose.Schema({
   title: { type: String, required: true },
   author: { type: String, required: true },
   publishedYear: { type: Number, required: true },
});

export const Book = mongoose.model("Book", bookSchema);
