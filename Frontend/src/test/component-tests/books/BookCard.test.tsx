import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookCard from '@/components/books/BookCard';
import type { Book } from '@/types/book';

/* --------------------  SVG icon mock  ---------------------- */
// – Her test dosyasında kopyalamak yerine, istersen src/test/setup.ts
//   içine taşıyabilirsin.
vi.mock('lucide-react', () => {
  const Mock = () => <svg data-testid="icon" />;
  return {
    __esModule: true,
    // gereksinim duyulan her ikon: Edit, Trash2, Eye, Book, Calendar, User
    Edit: Mock,
    Trash2: Mock,
    Eye: Mock,
    Book: Mock,
    Calendar: Mock,
    User: Mock,
  };
});

/* --------------------  Test veri seti  ---------------------- */
const sampleBook: Book = {
  id: '1',
  title: 'Clean Code',
  author: 'Robert C. Martin',
  year: 2008,
  isbn: '9780132350884',
  description: 'A Handbook of Agile Software Craftsmanship',
  type: 'Non-fiction',
  publisher: 'Prentice Hall',
  coverImageURL: '',
  // BookCard içinde genre & coverUrl property’si kullanılıyor
  genre: 'Programming',
  coverUrl: '',
  created_at: '',
  updated_at: '',
  deleted_at: null,
};

/* --------------------  Testler  ---------------------- */
describe('<BookCard />', () => {
  it('renders book info (title, author, year, genre)', () => {
    render(
      <BookCard
        book={sampleBook}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onView={vi.fn()}
      />,
    );

    expect(screen.getByText(/clean code/i)).toBeInTheDocument();
    expect(screen.getByText(/robert c\. martin/i)).toBeInTheDocument();
    expect(screen.getByText('2008')).toBeInTheDocument();
    expect(screen.getByText(/programming/i)).toBeInTheDocument();
  });

  it('calls onView when View button is clicked', async () => {
    const onView = vi.fn();
    render(
      <BookCard
        book={sampleBook}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onView={onView}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: /view/i }));
    expect(onView).toHaveBeenCalledWith(sampleBook);
  });

  it('calls onEdit and onDelete when action icons clicked', async () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <BookCard
        book={sampleBook}
        onEdit={onEdit}
        onDelete={onDelete}
        onView={vi.fn()}
      />,
    );

    // Edit
    await userEvent.click(screen.getByTitle(/edit book/i));
    expect(onEdit).toHaveBeenCalledWith(sampleBook);

    // Delete
    await userEvent.click(screen.getByTitle(/delete book/i));
    expect(onDelete).toHaveBeenCalledWith(sampleBook);
  });
});
