import { API_CONFIG, API_METHODS } from '../config/api';
import { Book, BookFormData } from '../types/book';

class BookService {
  private async fetchWithErrorHandling(url: string, options?: RequestInit) {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Network error: ${error.message}`);
      }
      throw new Error('Unknown error occurred');
    }
  }

  async getAllBooks(): Promise<Book[]> {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BOOKS}`;
    return this.fetchWithErrorHandling(url);
  }

  async getBookById(id: string): Promise<Book> {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BOOK_BY_ID(id)}`;
    return this.fetchWithErrorHandling(url);
  }

  async createBook(bookData: BookFormData): Promise<Book> {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BOOKS}`;
    return this.fetchWithErrorHandling(url, {
      method: API_METHODS.POST,
      body: JSON.stringify(bookData),
    });
  }

  async updateBook(id: string, bookData: BookFormData): Promise<Book> {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BOOK_BY_ID(id)}`;
    return this.fetchWithErrorHandling(url, {
      method: API_METHODS.PUT,
      body: JSON.stringify(bookData),
    });
  }

  async deleteBook(id: string): Promise<void> {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BOOK_BY_ID(id)}`;
    await this.fetchWithErrorHandling(url, {
      method: API_METHODS.DELETE,
    });
  }
}

export const bookService = new BookService();