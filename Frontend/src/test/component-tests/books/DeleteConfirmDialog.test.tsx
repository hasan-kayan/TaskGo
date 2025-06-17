import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeleteConfirmDialog from '@/components/books/DeleteConfirmDialog';
import { Book } from '@/types/book';

const dummyBook: Book = {
  id: 5,
  title: 'Design Patterns',
  author: 'Erich Gamma',
  year: 1994,
  genre: 'Software',
  isbn: '978-0201633610',
  pages: 395,
  publisher: 'Addison-Wesley',
  description: '',
  coverUrl: '',
  type: 'Non-Fiction',
};

describe('<DeleteConfirmDialog />', () => {
  it('invokes callbacks on user actions', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    render(
      <DeleteConfirmDialog
        book={dummyBook}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );

    await user.click(screen.getByRole('button', { name: /cancel/i }));
    await user.click(screen.getByRole('button', { name: /delete book/i }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('shows loading state when isLoading=true', () => {
    render(
      <DeleteConfirmDialog
        book={dummyBook}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        isLoading
      />,
    );

    const deleteBtn = screen.getByRole('button', { name: /deleting/i });
    expect(deleteBtn).toBeDisabled();
  });
});
