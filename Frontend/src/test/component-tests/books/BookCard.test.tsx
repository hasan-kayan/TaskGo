import { render, screen, fireEvent } from '@testing-library/react';
import BookCard from '@/components/books/BookCard';
import { describe, it, expect, vi } from 'vitest';
import { Book } from '@/types/book';

const sampleBook: Book = {
  id: 'book-1',
  title: 'Clean Code',
  author: 'Robert C. Martin',
  year: 2008,
  genre: 'Software',
  description: 'A handbook of Agile software craftsmanship.',
  coverUrl: '', // fallback icon path
};

describe('BookCard', () => {
  const onEdit = vi.fn();
  const onDelete = vi.fn();
  const onView = vi.fn();

  it('renders the book title, author, and genre', () => {
    render(
      <BookCard book={sampleBook} onEdit={onEdit} onDelete={onDelete} onView={onView} />
    );

    expect(screen.getByText(sampleBook.title)).toBeInTheDocument();
    expect(screen.getByText(sampleBook.author)).toBeInTheDocument();
    expect(screen.getByText(sampleBook.genre)).toBeInTheDocument();
  });

  it('renders fallback icon if no cover image is provided', () => {
    render(
      <BookCard book={sampleBook} onEdit={onEdit} onDelete={onDelete} onView={onView} />
    );

    const fallback = screen.getByTestId('icon-book');
    expect(fallback).toBeInTheDocument();
  });

  it('calls onView when View button is clicked', () => {
    render(
      <BookCard book={sampleBook} onEdit={onEdit} onDelete={onDelete} onView={onView} />
    );

    fireEvent.click(screen.getByTitle('View Details'));
    expect(onView).toHaveBeenCalledWith(sampleBook);
  });

  it('calls onEdit when Edit button is clicked', () => {
    render(
      <BookCard book={sampleBook} onEdit={onEdit} onDelete={onDelete} onView={onView} />
    );

    fireEvent.click(screen.getByTitle('Edit Book'));
    expect(onEdit).toHaveBeenCalledWith(sampleBook);
  });

  it('calls onDelete when Delete button is clicked', () => {
    render(
      <BookCard book={sampleBook} onEdit={onEdit} onDelete={onDelete} onView={onView} />
    );

    fireEvent.click(screen.getByTitle('Delete Book'));
    expect(onDelete).toHaveBeenCalledWith(sampleBook);
  });
});
