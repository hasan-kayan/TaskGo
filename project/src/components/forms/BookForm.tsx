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
  const [formData, setFormData] = useState({
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
        title: book.title || '',
        author: book.author || '',
        year: book.year?.toString() || '',
        isbn: book.isbn || '',
        description: book.description || '',
        genre: book.genre || '',
        pages: book.pages?.toString() || '',
        publisher: book.publisher || '',
        coverUrl: book.coverUrl || '',
      });
    }
  }, [book]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const fieldErrors = validateBook({ ...formData, [name]: formData[name] });
    setErrors(prev => ({ ...prev, [name]: fieldErrors[name] || '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateBook(formData);
    setErrors(validationErrors);

    if (!hasValidationErrors(validationErrors)) {
      try {
        const payload: BookFormData = {
          title: formData.title,
          author: formData.author,
          year: parseInt(formData.year) || 0,
          isbn: formData.isbn || undefined,
          description: formData.description || undefined,
          genre: formData.genre || undefined,
          pages: formData.pages ? parseInt(formData.pages) : undefined,
          publisher: formData.publisher || undefined,
          coverUrl: formData.coverUrl || undefined,
        };

        await onSubmit(payload);
      } catch (error) {
        console.error('Submit error:', error);
      }
    }
  };

  const inputClassName = (fieldName: string) =>
    `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
      errors[fieldName] && touched[fieldName] ? 'border-red-500 bg-red-50' : 'border-gray-300'
    }`;

  const genres = [
    'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction',
    'Fantasy', 'Biography', 'History', 'Self-Help', 'Business', 'Other'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} onBlur={handleBlur} className={inputClassName('title')} disabled={isLoading} />
          {errors.title && touched.title && <p className="text-sm text-red-600">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">Author *</label>
          <input type="text" id="author" name="author" value={formData.author} onChange={handleChange} onBlur={handleBlur} className={inputClassName('author')} disabled={isLoading} />
          {errors.author && touched.author && <p className="text-sm text-red-600">{errors.author}</p>}
        </div>

        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
          <input type="number" id="year" name="year" value={formData.year} onChange={handleChange} onBlur={handleBlur} className={inputClassName('year')} disabled={isLoading} />
          {errors.year && touched.year && <p className="text-sm text-red-600">{errors.year}</p>}
        </div>

        <div>
          <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
          <input type="text" id="isbn" name="isbn" value={formData.isbn} onChange={handleChange} className={inputClassName('isbn')} disabled={isLoading} />
        </div>

        <div>
          <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
          <select id="genre" name="genre" value={formData.genre} onChange={handleChange} className={inputClassName('genre')} disabled={isLoading}>
            <option value="">Select a genre</option>
            {genres.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="pages" className="block text-sm font-medium text-gray-700 mb-1">Pages</label>
          <input type="number" id="pages" name="pages" value={formData.pages} onChange={handleChange} className={inputClassName('pages')} disabled={isLoading} />
        </div>

        <div>
          <label htmlFor="publisher" className="block text-sm font-medium text-gray-700 mb-1">Publisher</label>
          <input type="text" id="publisher" name="publisher" value={formData.publisher} onChange={handleChange} className={inputClassName('publisher')} disabled={isLoading} />
        </div>

        <div>
          <label htmlFor="coverUrl" className="block text-sm font-medium text-gray-700 mb-1">Cover URL</label>
          <input type="url" id="coverUrl" name="coverUrl" value={formData.coverUrl} onChange={handleChange} className={inputClassName('coverUrl')} placeholder="https://example.com/image.jpg" disabled={isLoading} />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea id="description" name="description" rows={3} value={formData.description} onChange={handleChange} className={inputClassName('description')} disabled={isLoading} />
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200" disabled={isLoading}>Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center" disabled={isLoading}>
          {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
          {book ? 'Update Book' : 'Add Book'}
        </button>
      </div>
    </form>
  );
};

export default BookForm;
