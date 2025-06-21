// Environment configuration
const config = {
  development: {
    API_URL: 'http://localhost:3001' // Local development server
  },
  production: {
    API_URL: 'https://bookmanager-hzfmeaaqfeahavb9.eastus-01.azurewebsites.net'
  }
};

// Get environment
const environment = process.env.NODE_ENV || 'development';

// Get API URL from environment variable or fallback to config
export const API_URL = process.env.NEXT_PUBLIC_API_URL || config[environment]?.API_URL || config.production.API_URL;

// Debug logging (remove in production)
if (process.env.NODE_ENV !== 'production') {
  console.log('Environment:', environment);
  console.log('API_URL from env:', process.env.NEXT_PUBLIC_API_URL);
  console.log('Final API_URL:', API_URL);
}
