import React, { useEffect, useState } from 'react';
import { Book } from '../types/book';
import { useBooks } from '../context/BooksContext';
import { useBooksAPI } from '../hooks/useBooksAPI';
import Layout from '../components/layout/Layout';
import BookList from '../components/books/BookList';
import SearchAndFilter, { FilterOptions } from '../components/books/SearchAndFilter';
import BookDetail from '../components/books/BookDetail';
import BookForm from '../components/forms/BookForm';
import DeleteConfirmDialog from '../components/books/DeleteConfirmDialog';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

type ModalType = 'add' | 'edit' | 'view' | 'delete' | null;

const Dashboard: React.FC = () => {
  const { books, loading, error, selectedBook } = useBooks();
  const { fetchBooks, createBook, updateBook, deleteBook } = useBooksAPI();
  
  const [modalType, setModalType] = useState<ModalType>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Filter books based on search and filters
  useEffect(() => {
    let filtered = books;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
      );
    }

    // Apply genre filter
    if (filters.genre) {
      filtered = filtered.filter(book => book.genre === filters.genre);
    }

    // Apply year range filter
    if (filters.yearRange?.min) {
      filtered = filtered.filter(book => book.year >= filters.yearRange!.min!);
    }
    if (filters.yearRange?.max) {
      filtered = filtered.filter(book => book.year <= filters.yearRange!.max!);
    }

    setFilteredBooks(filtered);
  }, [books, searchQuery, filters]);

  const handleAddBook = () => {
    setModalType('add');
    setEditingBook(null);
  };

  const handleEditBook = (book: Book) => {
    setModalType('edit');
    setEditingBook(book);
  };

  const handleViewBook = (book: Book) => {
    setModalType('view');
    setEditingBook(book);
  };

  const handleDeleteBook = (book: Book) => {
    setModalType('delete');
    setDeletingBook(book);
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      if (modalType === 'add') {
        await createBook(formData);
      } else if (modalType === 'edit' && editingBook) {
        await updateBook(editingBook.id, formData);
      }
      closeModal();
    } catch (error) {
      // Error is handled by the API hook
    }
  };

  const handleConfirmDelete = async () => {
    if (deletingBook) {
      try {
        await deleteBook(deletingBook.id);
        closeModal();
      } catch (error) {
        // Error is handled by the API hook
      }
    }
  };

  const closeModal = () => {
    setModalType(null);
    setEditingBook(null);
    setDeletingBook(null);
  };

  const getModalTitle = () => {
    switch (modalType) {
      case 'add': return 'Add New Book';
      case 'edit': return 'Edit Book';
      case 'view': return 'Book Details';
      case 'delete': return 'Confirm Delete';
      default: return '';
    }
  };

  if (loading && books.length === 0) {
    return (
      <Layout onAddBook={handleAddBook}>
        <div className="flex justify-center items-center min-h-64">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (error && books.length === 0) {
    return (
      <Layout onAddBook={handleAddBook}>
        <ErrorMessage message={error} onRetry={fetchBooks} />
      </Layout>
    );
  }

  return (
    <Layout onAddBook={handleAddBook}>
      <div>
        <SearchAndFilter
          onSearch={setSearchQuery}
          onFilter={setFilters}
          totalBooks={books.length}
          filteredCount={filteredBooks.length}
        />

        <BookList
          books={filteredBooks}
          onEdit={handleEditBook}
          onDelete={handleDeleteBook}
          onView={handleViewBook}
        />

        {/* Form Modal */}
        <Modal
          isOpen={modalType === 'add' || modalType === 'edit'}
          onClose={closeModal}
          title={getModalTitle()}
          size="lg"
        >
          <BookForm
            book={editingBook || undefined}
            onSubmit={handleFormSubmit}
            onCancel={closeModal}
            isLoading={loading}
          />
        </Modal>

        {/* View Modal */}
        <Modal
          isOpen={modalType === 'view'}
          onClose={closeModal}
          title={getModalTitle()}
          size="xl"
        >
          {editingBook && <BookDetail book={editingBook} />}
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={modalType === 'delete'}
          onClose={closeModal}
          title={getModalTitle()}
          size="sm"
        >
          {deletingBook && (
            <DeleteConfirmDialog
              book={deletingBook}
              onConfirm={handleConfirmDelete}
              onCancel={closeModal}
              isLoading={loading}
            />
          )}
        </Modal>

        {error && (
          <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg">
            {error}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;