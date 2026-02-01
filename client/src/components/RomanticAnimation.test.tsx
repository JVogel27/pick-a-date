import { render } from '@testing-library/react';
import RomanticAnimation from './RomanticAnimation';

describe('RomanticAnimation', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders animation elements', () => {
    const { container } = render(<RomanticAnimation onComplete={() => {}} />);
    expect(container.querySelector('.romantic-animation')).toBeInTheDocument();
    expect(container.querySelector('.hearts-container')).toBeInTheDocument();
    expect(container.querySelector('.sparkles-container')).toBeInTheDocument();
  });

  it('calls onComplete after 2 seconds', () => {
    const mockOnComplete = jest.fn();
    render(<RomanticAnimation onComplete={mockOnComplete} />);

    expect(mockOnComplete).not.toHaveBeenCalled();

    jest.advanceTimersByTime(2000);

    expect(mockOnComplete).toHaveBeenCalledTimes(1);
  });

  it('renders multiple hearts', () => {
    const { container } = render(<RomanticAnimation onComplete={() => {}} />);
    const hearts = container.querySelectorAll('.heart');
    expect(hearts.length).toBe(12);
  });

  it('renders multiple sparkles', () => {
    const { container } = render(<RomanticAnimation onComplete={() => {}} />);
    const sparkles = container.querySelectorAll('.sparkle');
    expect(sparkles.length).toBe(20);
  });
});
