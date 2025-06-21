// Environment configuration
const config = {
   development: {
      API_URL: process.env.NEXT_PUBLIC_API_URL, // Use environment variable only
   },
   production: {
      API_URL: process.env.NEXT_PUBLIC_API_URL,
   },
};

// Get environment
const environment = process.env.NODE_ENV || "development";

// Get API URL from environment variable only
export const API_URL = config[environment]?.API_URL;

// Debug logging (remove in production)
if (process.env.NODE_ENV !== "production") {
   console.log("Environment:", environment);
   console.log("API_URL from env:", process.env.NEXT_PUBLIC_API_URL);
   console.log("Final API_URL:", API_URL);
}
