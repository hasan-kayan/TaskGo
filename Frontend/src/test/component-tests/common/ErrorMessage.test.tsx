import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorMessage from '@/components/common/ErrorMessage';

describe('<ErrorMessage />', () => {
  it('renders the error message', () => {
    render(<ErrorMessage message="Something went wrong." />);
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument(); // Retry yok
  });

  it('shows retry button if onRetry is provided and calls it on click', () => {
    const onRetry = vi.fn();
    render(<ErrorMessage message="Failed to fetch data." onRetry={onRetry} />);
    
    const button = screen.getByRole('button', { name: /try again/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
