import mongoose from "mongoose";

// Database connection function
export const connectDB = async (uri) => {
   try {
      await mongoose.connect(uri || process.env.MONGODB_URI);
      console.log("Connected to MongoDB");
   } catch (err) {
      console.error("MongoDB connection error:", err);
      throw err;
   }
};

// Database disconnection function
export const disconnectDB = async () => {
   try {
      await mongoose.connection.close();
      console.log("Disconnected from MongoDB");
   } catch (err) {
      console.error("MongoDB disconnection error:", err);
      throw err;
   }
};

export default { connectDB, disconnectDB };
