import React from 'react';
import { Book } from '../../types/book';
import { Book as BookIcon, User, Calendar, Hash, FileText, Bookmark, Building, Image } from 'lucide-react';

interface BookDetailProps {
  book: Book;
}

const BookDetail: React.FC<BookDetailProps> = ({ book }) => {
  const details = [
    { icon: User, label: 'Author', value: book.author },
    { icon: Calendar, label: 'Year', value: book.year.toString() },
    { icon: Hash, label: 'ISBN', value: book.isbn },
    { icon: Bookmark, label: 'Genre', value: book.genre },
    { icon: FileText, label: 'Pages', value: book.pages?.toString() },
    { icon: Building, label: 'Publisher', value: book.publisher },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Book Cover */}
          <div className="md:w-1/3 bg-gray-100">
            <div className="aspect-[3/4] relative">
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
                <BookIcon size={80} className="text-white opacity-80" />
              </div>
            </div>
          </div>

          {/* Book Details */}
          <div className="md:w-2/3 p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
              <p className="text-xl text-gray-600">{book.author}</p>
            </div>

            {/* Book Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {details.map(({ icon: Icon, label, value }) => (
                value && (
                  <div key={label} className="flex items-center">
                    <Icon size={18} className="text-gray-500 mr-3 flex-shrink-0" />
                    <div>
                      <span className="text-sm text-gray-500">{label}</span>
                      <p className="font-medium text-gray-900">{value}</p>
                    </div>
                  </div>
                )
              ))}
            </div>

            {/* Description */}
            {book.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{book.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;