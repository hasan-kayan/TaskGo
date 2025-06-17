import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Dashboard from '@/pages/Dashboard';

vi.mock('@/hooks/useBooksAPI', () => ({
  useBooksAPI: () => ({
    fetchBooks: vi.fn(),
    createBook: vi.fn(),
    updateBook: vi.fn(),
    deleteBook: vi.fn(),
  }),
}));

vi.mock('@/context/BooksContext', () => ({
  useBooks: () => ({
    books: mockBooks,
    loading: mockLoading,
    error: mockError,
    selectedBook: null,
  }),
}));

// local mock control
let mockBooks = [];
let mockLoading = false;
let mockError = '';

describe('Dashboard', () => {
  it('shows loading spinner when loading and books are empty', () => {
    mockBooks = [];
    mockLoading = true;
    mockError = '';
    render(<Dashboard />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows error message when error and books are empty', () => {
    mockBooks = [];
    mockLoading = false;
    mockError = 'Network error';
    render(<Dashboard />);

    expect(screen.getByText(/network error/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('renders BookList and SearchAndFilter when books are loaded', () => {
    mockBooks = [
      { id: '1', title: 'Book A', author: 'Author A', year: 2023, type: 'Fiction', isbn: '', description: '', publisher: '', coverImageURL: '', created_at: '', updated_at: '', deleted_at: null },
    ];
    mockLoading = false;
    mockError = '';
    render(<Dashboard />);

    expect(screen.getByPlaceholderText(/search books by title or author/i)).toBeInTheDocument();
    expect(screen.getByText(/book a/i)).toBeInTheDocument();
  });

  it('opens add book modal on + Add button click', () => {
    mockBooks = [];
    mockLoading = false;
    mockError = '';
    render(<Dashboard />);

    const addButton = screen.getByRole('button', { name: /\+ add book/i });
    fireEvent.click(addButton);

    expect(screen.getByText(/add new book/i)).toBeInTheDocument();
  });
});
