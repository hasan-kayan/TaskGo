import { API_CONFIG, API_METHODS } from '../config/api';
import { Book, BookFormData, ApiError } from '../types/book';

/* ────────────────────────────
 * Helpers
 * ──────────────────────────── */

const mapBook = (raw: any): Book => ({
  id: raw.id,
  title: raw.title,
  author: raw.author,
  year: raw.year,
  isbn: raw.isbn,
  description: raw.description,
  type: raw.type,
  publisher: raw.publisher,
  coverImageURL: raw.cover_image_url, // snake → camel
  created_at: raw.created_at,
  updated_at: raw.updated_at,
  deleted_at: raw.deleted_at,
});

/* ────────────────────────────
 * Service class
 * ──────────────────────────── */

class BookService {
  /** Generic fetch wrapper that returns backend `data` if success else throws. */
  private async request<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const res = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      const json = await res.json();

      if (!res.ok || json.success === false) {
        const message = json.error ?? `HTTP Error ${res.status}`;
        const err: ApiError = { error: message, status: res.status };
        throw err;
      }

      return json.data as T;
    } catch (e) {
      if ('error' in (e as any)) throw e; // already ApiError
      throw { error: (e as Error).message ?? 'Network error' } as ApiError;
    }
  }

  /* ───────── Books ───────── */

  async getAllBooks(): Promise<Book[]> {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BOOKS}`;
    const data = await this.request<any[]>(url);
    return data.map(mapBook);
  }

  async getBookById(id: string): Promise<Book> {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BOOK_BY_ID(id)}`;
    const data = await this.request<any>(url);
    return mapBook(data);
  }

  async createBook(bookData: BookFormData): Promise<Book> {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BOOKS}`;
    const data = await this.request<any>(url, {
      method: API_METHODS.POST,
      body: JSON.stringify(bookData),
    });
    return mapBook(data);
  }

  async updateBook(id: string, bookData: BookFormData): Promise<Book> {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BOOK_BY_ID(id)}`;
    const data = await this.request<any>(url, {
      method: API_METHODS.PUT,
      body: JSON.stringify(bookData),
    });
    return mapBook(data);
  }

  async deleteBook(id: string): Promise<void> {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BOOK_BY_ID(id)}`;
    await this.request<null>(url, { method: API_METHODS.DELETE });
  }
}

export const bookService = new BookService();
