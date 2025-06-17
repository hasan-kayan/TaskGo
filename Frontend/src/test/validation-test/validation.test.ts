// src/test/validation.test.ts
import { describe, expect, it } from 'vitest';
import {
  validateBook,
  hasValidationErrors,
  ValidationErrors,
} from '@/utils/validation';          // import yolunu proje yapına göre güncelle

import type { BookFormData } from '@/types/book';

// 🛠️ Yardımcı: kolay veri üretmek için
const makeData = (overrides: Partial<BookFormData> = {}): BookFormData => ({
  title: 'Dune',
  author: 'Frank Herbert',
  year: 1965,
  isbn: '9780441172719',
  pages: 412,
  type: 'Novel',
  ...overrides,
});

describe('validateBook()', () => {
  it('returns no errors when all fields are valid', () => {
    const errors = validateBook(makeData());
    expect(errors).toEqual({});
    expect(hasValidationErrors(errors)).toBe(false);
  });

  it('requires title and author ≥ 2 chars', () => {
    const errors = validateBook(makeData({ title: ' ', author: 'A' }));
    expect(errors).toMatchObject<ValidationErrors>({
      title: 'Title is required',
      author: 'Author name must be at least 2 characters long',
    });
  });

  it('validates year range', () => {
    const nextYear = new Date().getFullYear() + 2;
    const errors = validateBook(makeData({ year: nextYear }));
    expect(errors.year).toBe(`Year must be between 1000 and ${nextYear - 1}`);
  });

  it('rejects malformed ISBN', () => {
    const errors = validateBook(makeData({ isbn: '123' }));
    expect(errors.isbn).toBe('Invalid ISBN format');
  });

  it('rejects non-positive pages', () => {
    const errors = validateBook(makeData({ pages: 0 }));
    expect(errors.pages).toBe('Pages must be a positive number');
  });

  it('requires non-empty type ≥ 2 chars', () => {
    const errors = validateBook(makeData({ type: ' ' }));
    expect(errors.type).toBe('Type is required');

    const errors2 = validateBook(makeData({ type: 'A' }));
    expect(errors2.type).toBe('Type must be at least 2 characters long');
  });
});
