import { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { BooksProvider } from '@/context/BooksContext';

export const withProviders = (ui: ReactElement, route = '/') => {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: BooksProvider });
};
