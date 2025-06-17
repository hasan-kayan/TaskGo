import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BookDetail from '@/components/books/BookDetail';
import type { Book } from '@/types/book';

vi.mock('lucide-react', () => {
  const Mock = () => <svg data-testid="icon" />;
  return {
    __esModule: true,
    Book: Mock,
    User: Mock,
    Calendar: Mock,
    Hash: Mock,
    FileText: Mock,
    Bookmark: Mock,
    Building: Mock,
    Image: Mock,
  };
});

const sampleBook: Book = {
  id: '1',
  title: 'Clean Architecture',
  author: 'Robert C. Martin',
  year: 2017,
  isbn: '9780134494166',
  description: 'A guide to software structure and independence.',
  type: 'Non-fiction',
  publisher: 'Pearson',
  genre: 'Software Engineering',
  pages: 432,
  coverUrl: '',
  coverImageURL: '',
  created_at: '',
  updated_at: '',
  deleted_at: null,
};

describe('<BookDetail />', () => {
  it('renders book title and author', () => {
    render(<BookDetail book={sampleBook} />);

    // Başlık: semantik heading ile
    expect(
      screen.getByRole('heading', { name: /clean architecture/i }),
    ).toBeInTheDocument();

    // Yazar: iki kez görünür (üst başlık + detay grid)
    expect(
      screen.getAllByText(/robert c\. martin/i),
    ).toHaveLength(2);
  });

  it('renders all detail fields', () => {
    render(<BookDetail book={sampleBook} />);
    expect(screen.getByText('2017')).toBeInTheDocument();
    expect(screen.getByText('9780134494166')).toBeInTheDocument();
    expect(screen.getByText('Software Engineering')).toBeInTheDocument();
    expect(screen.getByText('432')).toBeInTheDocument();
    expect(screen.getByText('Pearson')).toBeInTheDocument();
  });

  it('renders description if present', () => {
    render(<BookDetail book={sampleBook} />);
    expect(screen.getByText(/a guide to software structure/i)).toBeInTheDocument();
  });
});
