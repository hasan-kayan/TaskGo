// src/test/component-tests/common/LoadingSpinner.test.tsx
import { render } from '@testing-library/react';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

describe('<LoadingSpinner />', () => {
  it('renders with default size (md)', () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.firstChild as HTMLElement;

    expect(spinner).toHaveClass('w-8 h-8');
    expect(spinner).toHaveClass('animate-spin');
  });

  it('renders with small size', () => {
    const { container } = render(<LoadingSpinner size="sm" />);
    const spinner = container.firstChild as HTMLElement;

    expect(spinner).toHaveClass('w-4 h-4');
  });

  it('renders with large size', () => {
    const { container } = render(<LoadingSpinner size="lg" />);
    const spinner = container.firstChild as HTMLElement;

    expect(spinner).toHaveClass('w-12 h-12');
  });

  it('applies custom className', () => {
    const { container } = render(<LoadingSpinner className="custom-class" />);
    const spinner = container.firstChild as HTMLElement;

    expect(spinner).toHaveClass('custom-class');
  });
});
