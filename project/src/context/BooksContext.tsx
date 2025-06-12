import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Book, ApiError } from '../types/book';

interface BooksState {
  books: Book[];
  selectedBook: Book | null;
  loading: boolean;
  error: string | null;
}

type BooksAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_BOOKS'; payload: Book[] }
  | { type: 'ADD_BOOK'; payload: Book }
  | { type: 'UPDATE_BOOK'; payload: Book }
  | { type: 'DELETE_BOOK'; payload: string }
  | { type: 'SET_SELECTED_BOOK'; payload: Book | null };

const initialState: BooksState = {
  books: [],
  selectedBook: null,
  loading: false,
  error: null,
};

const booksReducer = (state: BooksState, action: BooksAction): BooksState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_BOOKS':
      return { ...state, books: action.payload, loading: false, error: null };
    case 'ADD_BOOK':
      return { ...state, books: [...state.books, action.payload] };
    case 'UPDATE_BOOK':
      return {
        ...state,
        books: state.books.map(book => 
          book.id === action.payload.id ? action.payload : book
        ),
      };
    case 'DELETE_BOOK':
      return {
        ...state,
        books: state.books.filter(book => book.id !== action.payload),
      };
    case 'SET_SELECTED_BOOK':
      return { ...state, selectedBook: action.payload };
    default:
      return state;
  }
};

interface BooksContextType extends BooksState {
  dispatch: React.Dispatch<BooksAction>;
}

const BooksContext = createContext<BooksContextType | undefined>(undefined);

export const BooksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(booksReducer, initialState);

  return (
    <BooksContext.Provider value={{ ...state, dispatch }}>
      {children}
    </BooksContext.Provider>
  );
};

export const useBooks = () => {
  const context = useContext(BooksContext);
  if (context === undefined) {
    throw new Error('useBooks must be used within a BooksProvider');
  }
  return context;
};