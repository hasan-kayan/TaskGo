import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { bookService } from '@/services/bookService';
import { BookFormData } from '@/types/book';

const mockBook = {
  id: '1',
  title: 'Dune',
  author: 'Frank Herbert',
  year: 1965,
  isbn: '9780441172719',
  description: 'Sci-fi classic',
  type: 'Fiction',
  publisher: 'Ace Books',
  cover_image_url: 'https://example.com/dune.jpg',
  created_at: '2023-01-01',
  updated_at: '2023-01-01',
  deleted_at: null,
};

describe('BookService', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fetches all books and maps them', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [mockBook] }),
    });

    const books = await bookService.getAllBooks();
    expect(fetch).toHaveBeenCalled();
    expect(books[0].title).toBe('Dune');
    expect(books[0].coverImageURL).toBe('https://example.com/dune.jpg');
  });

  it('fetches a book by ID and maps it', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockBook }),
    });

    const book = await bookService.getBookById('1');
    expect(fetch).toHaveBeenCalled();
    expect(book.id).toBe('1');
    expect(book.title).toBe('Dune');
  });

  it('creates a new book and maps it', async () => {
    const newBook: BookFormData = {
      title: '1984',
      author: 'George Orwell',
      year: 1949,
      isbn: '9780451524935',
      pages: 328,
      type: 'Fiction',
      publisher: 'Plume',
      description: 'Dystopian novel',
      coverImageURL: 'https://example.com/1984.jpg',
    };

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { ...newBook, id: '2', created_at: '', updated_at: '', deleted_at: null } }),
    });

    const book = await bookService.createBook(newBook);
    expect(fetch).toHaveBeenCalled();
    expect(book.id).toBe('2');
    expect(book.title).toBe('1984');
  });

  it('updates an existing book', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockBook }),
    });

    const updated = await bookService.updateBook('1', mockBook);
    expect(fetch).toHaveBeenCalled();
    expect(updated.title).toBe('Dune');
  });

  it('deletes a book without returning data', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: null }),
    });

    await expect(bookService.deleteBook('1')).resolves.toBeUndefined();
    expect(fetch).toHaveBeenCalled();
  });
});
