import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';

vi.mock('lucide-react', () => ({
  __esModule: true,
  Eye: (props: any) => React.createElement('svg', { ...props, 'data-testid': 'icon-eye' }),
  Edit: (props: any) => React.createElement('svg', { ...props, 'data-testid': 'icon-edit' }),
  Trash2: (props: any) => React.createElement('svg', { ...props, 'data-testid': 'icon-trash2' }),
  Calendar: (props: any) => React.createElement('svg', { ...props, 'data-testid': 'icon-calendar' }),
  User: (props: any) => React.createElement('svg', { ...props, 'data-testid': 'icon-user' }),
  Book: (props: any) => React.createElement('svg', { ...props, 'data-testid': 'icon-book' }),
  BookOpen: (props: any) => React.createElement('svg', { ...props, 'data-testid': 'icon-book-open' }),
  AlertTriangle: (props: any) => React.createElement('svg', { ...props, 'data-testid': 'icon-alert' }),
  Filter: (props: any) => React.createElement('svg', { ...props, 'data-testid': 'icon-filter' }),
  Search: (props: any) => React.createElement('svg', { ...props, 'data-testid': 'icon-search' }),
  X: (props: any) => React.createElement('svg', { ...props, 'data-testid': 'icon-x' }),
}));
