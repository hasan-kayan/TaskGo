import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBooksAPI } from '@/hooks/useBooksAPI';
import { BookFormData } from '@/types/book';

// 🔧  global stubs ------------------------------------------
vi.mock('@/context/BooksContext', () => ({
  useBooks: () => ({ dispatch: mockDispatch }),
}));

vi.mock('@/services/bookService', () => ({
  bookService: {
    getAllBooks: vi.fn(),
    getBookById: vi.fn(),
    createBook: vi.fn(),
    updateBook: vi.fn(),
    deleteBook: vi.fn(),
  },
}));

// local refs
const { bookService }: any = await import('@/services/bookService');
const mockDispatch = vi.fn();

const mockBook = { id: '1', title: 'Dune' };

beforeEach(() => {
  mockDispatch.mockReset();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('useBooksAPI', () => {
  it('fetchBooks → SET_BOOKS', async () => {
    bookService.getAllBooks.mockResolvedValueOnce([mockBook]);

    const { result } = renderHook(() => useBooksAPI());

    await act(async () => {
      await result.current.fetchBooks();
    });

    expect(bookService.getAllBooks).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_BOOKS',
      payload: [mockBook],
    });
  });

  it('fetchBookById → SET_SELECTED_BOOK', async () => {
    bookService.getBookById.mockResolvedValueOnce(mockBook);

    const { result } = renderHook(() => useBooksAPI());
    let book;

    await act(async () => {
      book = await result.current.fetchBookById('1');
    });

    expect(book).toEqual(mockBook);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_SELECTED_BOOK',
      payload: mockBook,
    });
  });

  it('createBook → ADD_BOOK', async () => {
    const newBook: BookFormData = { title: '1984', author: 'Orwell', year: 1949, isbn: '', pages: 0, type: 'Fiction', publisher: '' };
    bookService.createBook.mockResolvedValueOnce({ ...newBook, id: '2' });

    const { result } = renderHook(() => useBooksAPI());

    await act(async () => {
      await result.current.createBook(newBook);
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'ADD_BOOK',
      payload: { ...newBook, id: '2' },
    });
  });

  it('updateBook → UPDATE_BOOK', async () => {
    bookService.updateBook.mockResolvedValueOnce(mockBook);

    const { result } = renderHook(() => useBooksAPI());

    await act(async () => {
      await result.current.updateBook('1', mockBook);
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_BOOK',
      payload: mockBook,
    });
  });

  it('deleteBook → DELETE_BOOK', async () => {
    bookService.deleteBook.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useBooksAPI());

    await act(async () => {
      await result.current.deleteBook('1');
    });

    expect(bookService.deleteBook).toHaveBeenCalledWith('1');
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'DELETE_BOOK',
      payload: '1',
    });
  });
});
