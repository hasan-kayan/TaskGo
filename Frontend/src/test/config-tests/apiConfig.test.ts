import { describe, it, expect } from 'vitest';
import { API_CONFIG, API_METHODS } from '@/config/api';

describe('API_CONFIG', () => {
  it('has a valid BASE_URL', () => {
    expect(API_CONFIG.BASE_URL).toBe('http://localhost:8080');
  });

  it('returns correct endpoint for BOOKS and BOOK_BY_ID', () => {
    expect(API_CONFIG.ENDPOINTS.BOOKS).toBe('/books');
    expect(API_CONFIG.ENDPOINTS.BOOK_BY_ID('42')).toBe('/books/42');
  });
});

describe('API_METHODS', () => {
  it('includes standard HTTP methods', () => {
    expect(API_METHODS.GET).toBe('GET');
    expect(API_METHODS.POST).toBe('POST');
    expect(API_METHODS.PUT).toBe('PUT');
    expect(API_METHODS.DELETE).toBe('DELETE');
  });
});
