import React, { useState, useEffect } from 'react';
import { Book, BookFormData } from '../../types/book';
import {
  validateBook,
  ValidationErrors,
  hasValidationErrors,
} from '../../utils/validation';
import LoadingSpinner from '../common/LoadingSpinner';
import { useBooks } from '../../context/BooksContext';

interface BookFormProps {
  book?: Book;
  onSubmit: (data: BookFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const BookForm: React.FC<BookFormProps> = ({
  book,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  /* ───────────────────────────────────────── context ─── */
  const { books } = useBooks();

  const uniqueTypes = Array.from(
    new Set(
      books
        .map((b) => b.type)
        .filter((t): t is string => Boolean(t?.trim())),
    ),
  );

  const typeOptions = uniqueTypes.length
    ? uniqueTypes
    : [
        'Fiction',
        'Non-Fiction',
        'Mystery',
        'Romance',
        'Science Fiction',
        'Fantasy',
        'Biography',
        'History',
        'Self-Help',
        'Business',
      ];

  /* ───────────────────────────────────────── state ─── */
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    year: '',
    isbn: '',
    description: '',
    type: '',
    pages: '',
    publisher: '',
    coverImageURL: '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  /* ───────────────────────────── hydrate for edit ─── */
  useEffect(() => {
    if (!book) return;
    setFormData({
      title: book.title ?? '',
      author: book.author ?? '',
      year: book.year?.toString() ?? '',
      isbn: book.isbn ?? '',
      description: book.description ?? '',
      type: book.type ?? '',
      pages: book.pages?.toString() ?? '',
      publisher: book.publisher ?? '',
      coverImageURL: book.coverImageURL ?? '',
    });
  }, [book]);

  /* ───────────────────────────── handlers ─── */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
    if (errors[name]) setErrors((s) => ({ ...s, [name]: '' }));
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    const fieldErrs = validateBook({ ...formData, [name]: formData[name] });
    if (fieldErrs[name]) setErrors((s) => ({ ...s, [name]: fieldErrs[name] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateBook(formData);
    setErrors(validationErrors);

    if (hasValidationErrors(validationErrors)) return;

    const payload: BookFormData = {
      title: formData.title.trim(),
      author: formData.author.trim(),
      year: Number(formData.year) || 0,
      isbn: formData.isbn || undefined,
      description: formData.description || undefined,
      type: formData.type || undefined,
      pages: formData.pages ? Number(formData.pages) : undefined,
      publisher: formData.publisher || undefined,
      coverImageURL: formData.coverImageURL || undefined,
    };

    await onSubmit(payload);
  };

  const inputClass = (field: string) =>
    `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
      errors[field] && touched[field]
        ? 'border-red-500 bg-red-50'
        : 'border-gray-300'
    }`;

  /* ───────────────────────────────────────── render ─── */
  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-4"
      data-testid="book-form"
    >
      {/* === grid === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title *
          </label>
          <input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClass('title')}
            disabled={isLoading}
          />
          {errors.title && touched.title && (
            <p role="alert" className="text-sm text-red-600">
              {errors.title}
            </p>
          )}
        </div>

        {/* Author */}
        <div>
          <label htmlFor="author" className="block text-sm font-medium mb-1">
            Author *
          </label>
          <input
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClass('author')}
            disabled={isLoading}
          />
          {errors.author && touched.author && (
            <p role="alert" className="text-sm text-red-600">
              {errors.author}
            </p>
          )}
        </div>

        {/* Year */}
        <div>
          <label htmlFor="year" className="block text-sm font-medium mb-1">
            Year *
          </label>
          <input
            type="number"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClass('year')}
            disabled={isLoading}
          />
          {errors.year && touched.year && (
            <p role="alert" className="text-sm text-red-600">
              {errors.year}
            </p>
          )}
        </div>

        {/* --- OPTIONAL FIELDS --- */}
        {/* ISBN */}
        <div>
          <label htmlFor="isbn" className="block text-sm font-medium mb-1">
            ISBN
          </label>
          <input
            id="isbn"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            className={inputClass('isbn')}
            disabled={isLoading}
          />
        </div>

        {/* Type / Genre */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium mb-1">
            Type / Genre
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={inputClass('type')}
            disabled={isLoading}
          >
            <option value="">Select type</option>
            {typeOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Pages */}
        <div>
          <label htmlFor="pages" className="block text-sm font-medium mb-1">
            Pages
          </label>
          <input
            type="number"
            id="pages"
            name="pages"
            value={formData.pages}
            onChange={handleChange}
            className={inputClass('pages')}
            disabled={isLoading}
          />
        </div>

        {/* Publisher */}
        <div>
          <label htmlFor="publisher" className="block text-sm font-medium mb-1">
            Publisher
          </label>
          <input
            id="publisher"
            name="publisher"
            value={formData.publisher}
            onChange={handleChange}
            className={inputClass('publisher')}
            disabled={isLoading}
          />
        </div>

        {/* Cover URL */}
        <div>
          <label
            htmlFor="coverImageURL"
            className="block text-sm font-medium mb-1"
          >
            Cover URL
          </label>
          <input
            id="coverImageURL"
            name="coverImageURL"
            type="url"
            value={formData.coverImageURL}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className={inputClass('coverImageURL')}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className={inputClass('description')}
          disabled={isLoading}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 border-t pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 flex items-center"
          disabled={isLoading}
        >
          {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
          {book ? 'Update Book' : 'Add Book'}
        </button>
      </div>
    </form>
  );
};

export default BookForm;
