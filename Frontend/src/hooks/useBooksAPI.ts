import { useCallback } from 'react';
import { useBooks } from '../context/BooksContext';
import { bookService } from '../services/bookService';
import { BookFormData } from '../types/book';

export const useBooksAPI = () => {
  const { dispatch } = useBooks();

  const setLoading = (flag: boolean) =>
    dispatch({ type: 'SET_LOADING', payload: flag });

  /* ──────────────────── READ ─────────────────── */

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const books = await bookService.getAllBooks();
      dispatch({ type: 'SET_BOOKS', payload: books });
    } catch (err: any) {
      dispatch({
        type: 'SET_ERROR',
        payload: err?.error ?? 'Failed to fetch books',
      });
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const fetchBookById = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const book = await bookService.getBookById(id);
        dispatch({ type: 'SET_SELECTED_BOOK', payload: book });
        return book;
      } catch (err: any) {
        dispatch({
          type: 'SET_ERROR',
          payload: err?.error ?? 'Failed to fetch book',
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  /* ──────────────────── CREATE ─────────────────── */

  const createBook = useCallback(
    async (data: BookFormData) => {
      setLoading(true);
      try {
        const newBook = await bookService.createBook(data);
        dispatch({ type: 'ADD_BOOK', payload: newBook });
        return newBook;
      } catch (err: any) {
        dispatch({
          type: 'SET_ERROR',
          payload: err?.error ?? 'Failed to create book',
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  /* ──────────────────── UPDATE ─────────────────── */

  const updateBook = useCallback(
    async (id: string, data: BookFormData) => {
      setLoading(true);
      try {
        const updated = await bookService.updateBook(id, data);
        dispatch({ type: 'UPDATE_BOOK', payload: updated });
        return updated;
      } catch (err: any) {
        dispatch({
          type: 'SET_ERROR',
          payload: err?.error ?? 'Failed to update book',
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  /* ──────────────────── DELETE ─────────────────── */

  const deleteBook = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        await bookService.deleteBook(id);
        dispatch({ type: 'DELETE_BOOK', payload: id });
      } catch (err: any) {
        dispatch({
          type: 'SET_ERROR',
          payload: err?.error ?? 'Failed to delete book',
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  return { fetchBooks, fetchBookById, createBook, updateBook, deleteBook };
};
