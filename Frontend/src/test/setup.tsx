import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('lucide-react', () => ({
  __esModule: true,
  default: (props) => <svg {...props} data-testid="icon" />,
}));

// Generic fetch mock – can be overwritten inside each test
beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    } as Response),
  ) as unknown as typeof fetch;
});
