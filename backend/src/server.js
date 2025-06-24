import { createApp } from "../app.js";
import { connectDB } from "./config/database.js";

const startServer = async () => {
   try {
      // Connect to database
      await connectDB();

      // Create Express app
      const app = createApp();

      // Start server
      const PORT = process.env.PORT || 5000;
      const server = app.listen(PORT, () => {
         console.log(`Server running on port ${PORT}`);
         console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
      });

      // Graceful shutdown
      process.on("SIGTERM", () => {
         console.log("SIGTERM received, shutting down gracefully");
         server.close(() => {
            console.log("Process terminated");
         });
      });

      process.on("SIGINT", () => {
         console.log("SIGINT received, shutting down gracefully");
         server.close(() => {
            console.log("Process terminated");
         });
      });
   } catch (error) {
      console.error("Failed to start server:", error);
      process.exit(1);
   }
};

export default startServer;

// Run server if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
   startServer();
}
