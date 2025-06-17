import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { BooksProvider, useBooks } from '@/context/BooksContext';
import type { Book } from '@/types/book';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BooksProvider>{children}</BooksProvider>
);

const sampleBook: Book = {
  id: '1',
  title: 'Dune',
  author: 'Frank Herbert',
  year: 1965,
  isbn: '9780441172719',
  description: '',
  type: 'Sci-Fi',
  publisher: '',
  coverImageURL: '',
  created_at: '',
  updated_at: '',
  deleted_at: null,
};

describe('BooksContext', () => {
  it('exposes initial state', () => {
    const { result } = renderHook(() => useBooks(), { wrapper });
    const state = result.current;
    expect(state.books).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('handles SET_BOOKS dispatch', () => {
    const { result } = renderHook(() => useBooks(), { wrapper });

    act(() => {
      result.current.dispatch({ type: 'SET_BOOKS', payload: [sampleBook] });
    });

    expect(result.current.books).toHaveLength(1);
    expect(result.current.books[0].title).toBe('Dune');
  });

  it('handles ADD_BOOK, UPDATE_BOOK, DELETE_BOOK', () => {
    const { result } = renderHook(() => useBooks(), { wrapper });

    // ADD
    act(() => {
      result.current.dispatch({ type: 'ADD_BOOK', payload: sampleBook });
    });
    expect(result.current.books).toHaveLength(1);

    // UPDATE
    act(() => {
      result.current.dispatch({
        type: 'UPDATE_BOOK',
        payload: { ...sampleBook, title: 'Dune - Updated' },
      });
    });
    expect(result.current.books[0].title).toBe('Dune - Updated');

    // DELETE
    act(() => {
      result.current.dispatch({ type: 'DELETE_BOOK', payload: '1' });
    });
    expect(result.current.books).toHaveLength(0);
  });

  it('throws if useBooks called outside provider', () => {
    const { result } = renderHook(() => {
      // intentionally no wrapper
      return expect(() => useBooks()).toThrow();
    });
  });
});
