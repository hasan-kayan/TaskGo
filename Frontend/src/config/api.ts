// API Configuration
// Update these endpoints to match your backend API
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080', // Update with your backend URL
  ENDPOINTS: {
    BOOKS: '/books',
    BOOK_BY_ID: (id: string) => `/books/${id}`,
  }
};

// HTTP methods for API calls
export const API_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
} as const;