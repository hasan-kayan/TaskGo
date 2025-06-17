import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BookList from '@/components/books/BookList';
import { Book } from '@/types/book';

const mockBooks: Book[] = [
  {
    id: '1',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    year: 2008,
    genre: 'Programming',
    description: 'A Handbook of Agile Software Craftsmanship',
    coverUrl: 'https://example.com/clean-code.jpg',
  },
  {
    id: '2',
    title: 'Refactoring',
    author: 'Martin Fowler',
    year: 1999,
    genre: 'Software Engineering',
    description: 'Improving the design of existing code.',
    coverUrl: 'https://example.com/refactoring.jpg',
  },
];

describe('BookList', () => {
  it('renders list of books correctly', () => {
    render(
      <BookList
        books={mockBooks}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onView={vi.fn()}
      />
    );

    mockBooks.forEach((book) => {
      expect(screen.getByText(book.title)).toBeInTheDocument();
      expect(screen.getByText(book.author)).toBeInTheDocument();
    });
  });

  it('handles onEdit and onDelete callbacks', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const onView = vi.fn();

    render(
      <BookList
        books={mockBooks}
        onEdit={onEdit}
        onDelete={onDelete}
        onView={onView}
      />
    );

    // Click edit and delete buttons on the first book
    const editButton = screen.getAllByTitle('Edit Book')[0];
    const deleteButton = screen.getAllByTitle('Delete Book')[0];
    const viewButton = screen.getAllByText('View')[0];

    fireEvent.click(editButton);
    fireEvent.click(deleteButton);
    fireEvent.click(viewButton);

    expect(onEdit).toHaveBeenCalledWith(mockBooks[0]);
    expect(onDelete).toHaveBeenCalledWith(mockBooks[0]);
    expect(onView).toHaveBeenCalledWith(mockBooks[0]);
  });

  it('renders a message if no books are provided', () => {
    render(
      <BookList books={[]} onEdit={vi.fn()} onDelete={vi.fn()} onView={vi.fn()} />
    );

    expect(
      screen.getByText(/no books to display/i)
    ).toBeInTheDocument();
  });
});
