import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import apiRoutes from "./src/routes/apiRoutes.js";
import { connectDB, disconnectDB } from "./src/config/database.js";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
export const createApp = () => {
   const app = express();

   // Middleware
   app.use(cors());
   app.use(express.json());

   // Serve static files from public (for Next.js static build)
   app.use(express.static(path.join(__dirname, "public")));

   // API Routes
   app.use("/api", apiRoutes);

   return app;
};

// Export database functions for backwards compatibility
export { connectDB, disconnectDB };
