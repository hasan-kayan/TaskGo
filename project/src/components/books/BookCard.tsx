import React from 'react';
import { Book as BookType } from '../../types/book';
import { Edit, Trash2, Eye, Book, Calendar, User } from 'lucide-react';

interface BookCardProps {
  book: BookType;
  onEdit: (book: BookType) => void;
  onDelete: (book: BookType) => void;
  onView: (book: BookType) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onEdit, onDelete, onView }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={`${book.title} cover`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`${book.coverUrl ? 'hidden' : ''} absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600`}>
          <Book size={48} className="text-white opacity-80" />
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2" title={book.title}>
          {book.title}
        </h3>
        
        <div className="space-y-1 mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <User size={14} className="mr-2 flex-shrink-0" />
            <span className="truncate">{book.author}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar size={14} className="mr-2 flex-shrink-0" />
            <span>{book.year}</span>
          </div>
          {book.genre && (
            <div className="mt-2">
              <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                {book.genre}
              </span>
            </div>
          )}
        </div>

        {book.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {book.description}
          </p>
        )}
        
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <button
            onClick={() => onView(book)}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            title="View Details"
          >
            <Eye size={16} className="mr-1" />
            <span className="text-sm">View</span>
          </button>
          
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(book)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit Book"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onDelete(book)}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Book"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;