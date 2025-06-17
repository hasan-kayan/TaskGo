import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BookList from '@/components/books/BookList';
import type { Book } from '@/types/book';

/* ---------- Mocklar ---------- */
vi.mock('lucide-react', () => ({
  __esModule: true,
  BookOpen: () => <svg data-testid="icon-book-open" />,
}));

/**
 * BookCard’ı tam render etmek yerine, props’ları test kolaylığı için
 * basit bir div’e aktarıyoruz.  
 * - Tek tıklama = onView  
 * - Sağ tıklama (contextmenu) = onEdit  
 * - Çift tıklama = onDelete
 */
const bookCardSpy = vi.fn();
vi.mock('@/components/books/BookCard', () => ({
  __esModule: true,
  default: ({ book, onEdit, onDelete, onView }: any) => {
    // Spye, her render edilen kitabı kaydedelim
    bookCardSpy(book);
    return (
      <div
        data-testid="mock-card"
        onClick={() => onView(book)}
        onContextMenu={(e) => {
          e.preventDefault();
          onEdit(book);
        }}
        onDoubleClick={() => onDelete(book)}
      >
        {book.title}
      </div>
    );
  },
}));

/* ---------- Test verisi ---------- */
const sampleBooks: Book[] = [
  {
    id: '1',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    year: 2008,
    isbn: '',
    description: '',
    type: 'Non-fiction',
    publisher: '',
    genre: 'Programming',
    pages: 464,
    coverUrl: '',
    coverImageURL: '',
    created_at: '',
    updated_at: '',
    deleted_at: null,
  },
  {
    id: '2',
    title: 'Refactoring',
    author: 'Martin Fowler',
    year: 1999,
    isbn: '',
    description: '',
    type: 'Non-fiction',
    publisher: '',
    genre: 'Programming',
    pages: 448,
    coverUrl: '',
    coverImageURL: '',
    created_at: '',
    updated_at: '',
    deleted_at: null,
  },
];

/* ---------- Testler ---------- */
describe('<BookList />', () => {
  it('shows empty state when no books', () => {
    render(
      <BookList books={[]} onEdit={vi.fn()} onDelete={vi.fn()} onView={vi.fn()} />,
    );

    expect(screen.getByText(/no books found/i)).toBeInTheDocument();
    expect(screen.getByTestId('icon-book-open')).toBeInTheDocument();
  });

  it('renders a BookCard for each book', () => {
    bookCardSpy.mockClear();
    render(
      <BookList
        books={sampleBooks}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onView={vi.fn()}
      />,
    );

    expect(screen.getAllByTestId('mock-card')).toHaveLength(2);
    expect(bookCardSpy).toHaveBeenCalledTimes(2);
  });

  it('forwards onEdit, onDelete, onView callbacks', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const onView = vi.fn();

    render(
      <BookList
        books={[sampleBooks[0]]}
        onEdit={onEdit}
        onDelete={onDelete}
        onView={onView}
      />,
    );

    const card = screen.getByTestId('mock-card');

    // Tek tıklama -> onView
    fireEvent.click(card);
    expect(onView).toHaveBeenCalledWith(sampleBooks[0]);

    // Sağ tıklama (contextmenu) -> onEdit
    fireEvent.contextMenu(card);
    expect(onEdit).toHaveBeenCalledWith(sampleBooks[0]);

    // Çift tıklama -> onDelete
    fireEvent.doubleClick(card);
    expect(onDelete).toHaveBeenCalledWith(sampleBooks[0]);
  });
});
