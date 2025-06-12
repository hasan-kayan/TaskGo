import { useCallback } from 'react';
import { useBooks } from '../context/BooksContext';
import { bookService } from '../services/bookService';
import { BookFormData } from '../types/book';

export const useBooksAPI = () => {
  const { dispatch } = useBooks();

  const fetchBooks = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const books = await bookService.getAllBooks();
      dispatch({ type: 'SET_BOOKS', payload: books });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch books' });
    }
  }, [dispatch]);

  const fetchBookById = useCallback(async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const book = await bookService.getBookById(id);
      dispatch({ type: 'SET_SELECTED_BOOK', payload: book });
      return book;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch book' });
      throw error;
    }
  }, [dispatch]);

  const createBook = useCallback(async (bookData: BookFormData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const newBook = await bookService.createBook(bookData);
      dispatch({ type: 'ADD_BOOK', payload: newBook });
      return newBook;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to create book' });
      throw error;
    }
  }, [dispatch]);

  const updateBook = useCallback(async (id: string, bookData: BookFormData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const updatedBook = await bookService.updateBook(id, bookData);
      dispatch({ type: 'UPDATE_BOOK', payload: updatedBook });
      return updatedBook;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update book' });
      throw error;
    }
  }, [dispatch]);

  const deleteBook = useCallback(async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await bookService.deleteBook(id);
      dispatch({ type: 'DELETE_BOOK', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to delete book' });
      throw error;
    }
  }, [dispatch]);

  return {
    fetchBooks,
    fetchBookById,
    createBook,
    updateBook,
    deleteBook,
  };
};