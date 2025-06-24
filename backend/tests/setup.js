// Global test setup
console.log("Setting up test environment...");

// Increase timeout for database operations
jest.setTimeout(30000);

// Suppress console.log during tests unless needed
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeAll(() => {
   // Suppress MongoDB connection logs during testing
   console.log = (...args) => {
      const message = args.join(" ");
      if (
         !message.includes("Connected to MongoDB") &&
         !message.includes("Disconnected from MongoDB") &&
         !message.includes("MongoMemoryServer")
      ) {
         originalConsoleLog(...args);
      }
   };

   console.error = (...args) => {
      const message = args.join(" ");
      if (!message.includes("MongoDB") && !message.includes("MongoMemoryServer")) {
         originalConsoleError(...args);
      }
   };
});

afterAll(() => {
   console.log = originalConsoleLog;
   console.error = originalConsoleError;
});
