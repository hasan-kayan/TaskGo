// src/test/test-utils.tsx
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BooksProvider } from '@/context/BooksContext';

export function renderWithProviders(ui, options = {}) {
  return render(ui, {
    wrapper: ({ children }) => (
      <MemoryRouter>
        <BooksProvider>{children}</BooksProvider>
      </MemoryRouter>
    ),
    ...options,
  });
}
