import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { Book } from "../../src/models/Book.js";

let mongoServer;

// Setup in-memory MongoDB for testing
export const setupTestDB = async () => {
   mongoServer = await MongoMemoryServer.create();
   const mongoUri = mongoServer.getUri();

   await mongoose.connect(mongoUri);
};

// Clean up after tests
export const teardownTestDB = async () => {
   if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
   }

   if (mongoServer) {
      await mongoServer.stop();
   }
};

// Clear all collections
export const clearTestDB = async () => {
   const collections = mongoose.connection.collections;

   for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
   }
};

// Seed test data
export const seedTestData = async (books) => {
   await Book.insertMany(books);
};

// Get test database connection
export const getTestDBConnection = () => {
   return mongoose.connection;
};
