import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchAndFilter, {
  FilterOptions,
} from '@/components/books/SearchAndFilter';
import { vi } from 'vitest';

// --- mock BooksContext so the hook returns predictable data -----------
vi.mock('@/context/BooksContext', () => ({
  useBooks: () => ({
    books: [
      { id: 7, title: 'Foo', author: 'Bar', year: 2020, type: 'Fiction' },
      { id: 8, title: 'Baz', author: 'Qux', year: 2010, type: 'History' },
    ],
  }),
}));

describe('<SearchAndFilter />', () => {
  const onSearch = vi.fn();
  const onFilter = vi.fn();

  beforeEach(() => {
    onSearch.mockReset();
    onFilter.mockReset();
  });

  function renderComp(filtered = 2) {
    render(
      <SearchAndFilter
        onSearch={onSearch}
        onFilter={onFilter}
        totalBooks={2}
        filteredCount={filtered}
      />,
    );
  }

  it('calls onSearch while typing', async () => {
    const user = userEvent.setup();
    renderComp();

    await user.type(
      screen.getByPlaceholderText(/search books/i),
      'great book',
    );

    expect(onSearch).toHaveBeenLastCalledWith('great book');
  });

  it('toggles filter panel and applies type filter', async () => {
    const user = userEvent.setup();
    renderComp();

    await user.click(screen.getByRole('button', { name: /filters/i }));
    expect(
      screen.getByRole('combobox', { name: /type/i }),
    ).toBeInTheDocument();

    await user.selectOptions(
      screen.getByRole('combobox', { name: /type/i }),
      'History',
    );

    const expectedPatch: FilterOptions = { type: 'History' };
    expect(onFilter).toHaveBeenCalledWith(expectedPatch);
  });

  it('clears all filters', async () => {
    const user = userEvent.setup();
    renderComp(1); // show "Filters active" badge

    // open filters & apply something
    await user.click(screen.getByRole('button', { name: /filters/i }));
    await user.selectOptions(
      screen.getByRole('combobox', { name: /type/i }),
      'Fiction',
    );

    // click 'X' (clear all)
    await user.click(
      screen.getByRole('button', { name: /clear all filters/i }),
    );

    expect(onSearch).toHaveBeenCalledWith('');
    expect(onFilter).toHaveBeenLastCalledWith({});
  });
});
