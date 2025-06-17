import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DeleteConfirmDialog from '@/components/books/DeleteConfirmDialog';
import type { Book } from '@/types/book';

vi.mock('lucide-react', () => ({
  __esModule: true,
  AlertTriangle: () => <svg data-testid="alert-icon" />,
}));

const sampleBook: Book = {
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
};

describe('<DeleteConfirmDialog />', () => {
  it('renders title, author, and icon', () => {
    render(
      <DeleteConfirmDialog
        book={sampleBook}
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />
    );

    expect(screen.getByRole('heading', { name: /delete book/i })).toBeInTheDocument();
    expect(screen.getByText(/clean code/i)).toBeInTheDocument();
    expect(screen.getByText(/robert c\. martin/i)).toBeInTheDocument();
    expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
  });

  it('calls onCancel and onConfirm correctly', () => {
    const onCancel = vi.fn();
    const onConfirm = vi.fn();

    render(
      <DeleteConfirmDialog
        book={sampleBook}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    fireEvent.click(screen.getByRole('button', { name: /delete book/i }));

    expect(onCancel).toHaveBeenCalledOnce();
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('disables buttons and shows "Deleting..." when isLoading is true', () => {
    render(
      <DeleteConfirmDialog
        book={sampleBook}
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
        isLoading={true}
      />
    );

    expect(screen.getByRole('button', { name: /deleting/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
  });
});
