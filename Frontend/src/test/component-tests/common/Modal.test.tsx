// src/test/component-tests/common/Modal.test.tsx
import { render, fireEvent } from '@testing-library/react';
import Modal from '../../../components/common/Modal';

describe('<Modal />', () => {
  const title = 'Test Modal';
  const content = 'This is modal content';

  it('does not render when isOpen is false', () => {
    const { queryByText } = render(
      <Modal isOpen={false} onClose={() => {}} title={title}>
        {content}
      </Modal>
    );
    expect(queryByText(title)).not.toBeInTheDocument();
    expect(queryByText(content)).not.toBeInTheDocument();
  });

  it('renders correctly when open', () => {
    const { getByText } = render(
      <Modal isOpen={true} onClose={() => {}} title={title}>
        {content}
      </Modal>
    );
    expect(getByText(title)).toBeInTheDocument();
    expect(getByText(content)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    const { getByRole } = render(
      <Modal isOpen={true} onClose={onClose} title={title}>
        {content}
      </Modal>
    );
    fireEvent.click(getByRole('button'));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when background is clicked', () => {
    const onClose = vi.fn();
    const { container } = render(
      <Modal isOpen={true} onClose={onClose} title={title}>
        {content}
      </Modal>
    );

    const background = container.querySelector('.bg-black');
    fireEvent.click(background!);
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title={title}>
        {content}
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('applies correct size class', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={() => {}} title={title} size="lg">
        {content}
      </Modal>
    );

    const modal = container.querySelector('.transform');
    expect(modal).toHaveClass('max-w-2xl');
  });
});
