import React from 'react';
import { Book } from '../../types/book';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmDialogProps {
  book: Book;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({ 
  book, 
  onConfirm, 
  onCancel, 
  isLoading = false 
}) => {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-red-100 rounded-full">
          <AlertTriangle size={24} className="text-red-600" />
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Book</h3>
      <p className="text-gray-600 mb-6">
        Are you sure you want to delete <strong>"{book.title}"</strong> by {book.author}? 
        This action cannot be undone.
      </p>
      
      <div className="flex justify-center space-x-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Deleting...' : 'Delete Book'}
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmDialog;