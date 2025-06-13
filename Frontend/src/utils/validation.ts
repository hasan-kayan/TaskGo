import { BookFormData } from '../types/book';

export interface ValidationErrors {
  [key: string]: string;
}

export const validateBook = (data: BookFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Title validation
  if (!data.title.trim()) {
    errors.title = 'Title is required';
  } else if (data.title.trim().length < 2) {
    errors.title = 'Title must be at least 2 characters long';
  }

  // Author validation
  if (!data.author.trim()) {
    errors.author = 'Author is required';
  } else if (data.author.trim().length < 2) {
    errors.author = 'Author name must be at least 2 characters long';
  }

  // Year validation
  if (data.year === '') {
    errors.year = 'Publication year is required';
  } else {
    const currentYear = new Date().getFullYear();
    const year = typeof data.year === 'string' ? parseInt(data.year, 10) : data.year;
    
    if (isNaN(year) || year < 1000 || year > currentYear + 1) {
      errors.year = `Year must be between 1000 and ${currentYear + 1}`;
    }
  }

  // ISBN validation (optional but if provided, should be valid format)
  if (data.isbn && data.isbn.trim()) {
    const isbnRegex = /^(?:(?:97[89])?\d{9}[\dX])$/;
    const cleanISBN = data.isbn.replace(/[-\s]/g, '');
    if (!isbnRegex.test(cleanISBN)) {
      errors.isbn = 'Invalid ISBN format';
    }
  }

  // Pages validation (optional but if provided, should be positive)
  if (data.pages !== undefined && data.pages !== '') {
    const pages = typeof data.pages === 'string' ? parseInt(data.pages, 10) : data.pages;
    if (isNaN(pages) || pages < 1) {
      errors.pages = 'Pages must be a positive number';
    }
  }

  // Type (validation)
  if (!data.type || data.type.trim() === '') {
    errors.type = 'Type is required';
  } else if (data.type.trim().length < 2) {
    errors.type = 'Type must be at least 2 characters long';
  }
  return errors;
};

export const hasValidationErrors = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};