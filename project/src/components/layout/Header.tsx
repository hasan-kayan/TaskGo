import React from 'react';
import { Library, Plus } from 'lucide-react';

interface HeaderProps {
  onAddBook: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddBook }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Library size={32} className="text-blue-600 mr-3" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Library Manager</h1>
              <p className="text-sm text-gray-500">Manage your book collection</p>
            </div>
          </div>
          
          <button
            onClick={onAddBook}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus size={20} className="mr-2" />
            Add Book
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;