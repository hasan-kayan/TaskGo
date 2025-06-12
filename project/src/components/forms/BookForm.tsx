import React, { useState, useEffect } from 'react';
import { Book, BookFormData } from '../../types/book';
import { validateBook, ValidationErrors, hasValidationErrors } from '../../utils/validation';
import LoadingSpinner from '../common/LoadingSpinner';

interface BookFormProps {
  book?: Book;
  onSubmit: (data: BookFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const BookForm: React.FC<BookFormProps> = ({ book, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    year: '',
    isbn: '',
    description: '',
    genre: '',
    pages: '',
    publisher: '',
    coverUrl: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        year: book.year,
        isbn: book.isbn || '',
        description: book.description || '',
        genre: book.genre || '',
        pages: book.pages || '',
        publisher: book.publisher || '',
        coverUrl: book.coverUrl || '',
      });
    }
  }, [book]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate field on blur
    const fieldErrors = validateBook(formData);
    setErrors(prev => ({ ...prev, [name]: fieldErrors[name] || '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateBook(formData);
    setErrors(validationErrors);
    
    if (!hasValidationErrors(validationErrors)) {
      try {
        await onSubmit(formData);
      } catch (error) {
        // Error handling is managed by the parent component
      }
    }
  };

  const inputClassName = (fieldName: string) => 
    `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
      errors[fieldName] && touched[fieldName] 
        ? 'border-red-500 bg-red-50' 
        : 'border-gray-300 hover:border-gray-400'
    }`;

  const genres = [
    'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction', 
    'Fantasy', 'Biography', 'History', 'Self-Help', 'Business', 'Other'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClassName('title')}
            disabled={isLoading}
          />
          {errors.title && touched.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
            Author *
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClassName('author')}
            disabled={isLoading}
          />
          {errors.author && touched.author && (
            <p className="mt-1 text-sm text-red-600">{errors.author}</p>
          )}
        </div>

        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
            Publication Year *
          </label>
          <input
            type="number"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClassName('year')}
            disabled={isLoading}
          />
          {errors.year && touched.year && (
            <p className="mt-1 text-sm text-red-600">{errors.year}</p>
          )}
        </div>

        <div>
          <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-1">
            ISBN
          </label>
          <input
            type="text"
            id="isbn"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClassName('isbn')}
            placeholder="978-0-123456-78-9"
            disabled={isLoading}
          />
          {errors.isbn && touched.isbn && (
            <p className="mt-1 text-sm text-red-600">{errors.isbn}</p>
          )}
        </div>

        <div>
          <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
            Genre
          </label>
          <select
            id="genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            className={inputClassName('genre')}
            disabled={isLoading}
          >
            <option value="">Select a genre</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="pages" className="block text-sm font-medium text-gray-700 mb-1">
            Pages
          </label>
          <input
            type="number"
            id="pages"
            name="pages"
            value={formData.pages}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClassName('pages')}
            disabled={isLoading}
          />
          {errors.pages && touched.pages && (
            <p className="mt-1 text-sm text-red-600">{errors.pages}</p>
          )}
        </div>

        <div>
          <label htmlFor="publisher" className="block text-sm font-medium text-gray-700 mb-1">
            Publisher
          </label>
          <input
            type="text"
            id="publisher"
            name="publisher"
            value={formData.publisher}
            onChange={handleChange}
            className={inputClassName('publisher')}
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="coverUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Cover Image URL
          </label>
          <input
            type="url"
            id="coverUrl"
            name="coverUrl"
            value={formData.coverUrl}
            onChange={handleChange}
            className={inputClassName('coverUrl')}
            placeholder="https://example.com/cover.jpg"
            disabled={isLoading}
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className={inputClassName('description')}
          placeholder="Brief description of the book..."
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
          {book ? 'Update Book' : 'Add Book'}
        </button>
      </div>
    </form>
  );
};

export default BookForm;