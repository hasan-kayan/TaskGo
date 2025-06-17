import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import SearchAndFilter from '@/components/books/SearchAndFilter';
import { BooksProvider } from '@/context/BooksContext';

describe('<SearchAndFilter />', () => {
  const renderComponent = () => {
    const onSearch = vi.fn();
    const onFilter = vi.fn();

    render(
      <BooksProvider>
        <SearchAndFilter
          onSearch={onSearch}
          onFilter={onFilter}
          totalBooks={10}
          filteredCount={10}
        />
      </BooksProvider>
    );

    return { onSearch, onFilter };
  };

  it('calls onSearch while typing', () => {
    const { onSearch } = renderComponent();

    const input = screen.getByPlaceholderText(/search books/i);
    fireEvent.change(input, { target: { value: 'Clean Code' } });

    expect(onSearch).toHaveBeenCalledWith('Clean Code');
  });

  it('toggles filter panel and applies type filter', () => {
    const { onFilter } = renderComponent();

    const toggleButton = screen.getByRole('button', { name: /filters/i });
    fireEvent.click(toggleButton);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'Fiction' } });

    expect(onFilter).toHaveBeenCalledWith({ type: 'Fiction' });
  });

  it('updates year filters and clears all', () => {
    const { onSearch, onFilter } = renderComponent();

    fireEvent.click(screen.getByRole('button', { name: /filters/i }));

    const fromYear = screen.getByPlaceholderText(/2000/i);
    const toYear = screen.getByPlaceholderText(/2024/i);

    fireEvent.change(fromYear, { target: { value: '2000' } });
    fireEvent.change(toYear, { target: { value: '2024' } });

    expect(onFilter).toHaveBeenCalledWith({ yearRange: { min: 2000 } });
    expect(onFilter).toHaveBeenCalledWith({ yearRange: { min: 2000, max: 2024 } });

    fireEvent.change(screen.getByPlaceholderText(/search books/i), { target: { value: 'test' } });

    const clearBtn = screen.getByTitle(/clear all filters/i);
    fireEvent.click(clearBtn);

    expect(onSearch).toHaveBeenCalledWith('');
    expect(onFilter).toHaveBeenCalledWith({});
  });
});
