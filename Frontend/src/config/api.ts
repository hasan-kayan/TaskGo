// src/config/api.ts
// ------------------------------------------------------------------
// Environment variables
//   • VITE_API_BASE_URL   – base URL of your backend (e.g. http://localhost:8080)
//   • VITE_API_KEY        – optional API key / token (if you need it later)
// ------------------------------------------------------------------

// 1.  Grab values from import.meta.env (Vite injects them at build time)
const {
  VITE_API_BASE_URL,
  VITE_API_KEY,
} = import.meta.env as {
  VITE_API_BASE_URL?: string;
  VITE_API_KEY?: string;
};

// 2.  Fallbacks (so devs aren’t blocked if .env is missing)
const DEFAULT_BASE_URL = 'http://localhost:8080';

export const API_CONFIG = {
  BASE_URL: VITE_API_BASE_URL ?? DEFAULT_BASE_URL,
  ENDPOINTS: {
    BOOKS: '/books',
    BOOK_BY_ID: (id: string) => `/books/${id}`,
  },
  // expose key/token only if you actually use it in requests
  API_KEY: VITE_API_KEY,
} as const;

// 3.  Canonical HTTP verbs
export const API_METHODS = {
  GET:  'GET',
  POST: 'POST',
  PUT:  'PUT',
  DELETE: 'DELETE',
} as const;
