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
    expect(container.querySelector('.spiral-phase')).toBeInTheDocument();
    expect(container.querySelector('.burst-phase')).toBeInTheDocument();
    expect(container.querySelector('.kaleidoscope-phase')).toBeInTheDocument();
    expect(container.querySelector('.center-glow')).toBeInTheDocument();
  });

  it('calls onComplete after 3.5 seconds', () => {
    const mockOnComplete = jest.fn();
    render(<RomanticAnimation onComplete={mockOnComplete} />);

    expect(mockOnComplete).not.toHaveBeenCalled();

    jest.advanceTimersByTime(3500);

    expect(mockOnComplete).toHaveBeenCalledTimes(1);
  });

  it('renders spiral symbols', () => {
    const { container } = render(<RomanticAnimation onComplete={() => {}} />);
    const spiralSymbols = container.querySelectorAll('.spiral-symbol');
    expect(spiralSymbols.length).toBe(8);
  });

  it('renders burst symbols', () => {
    const { container } = render(<RomanticAnimation onComplete={() => {}} />);
    const burstSymbols = container.querySelectorAll('.burst-symbol');
    expect(burstSymbols.length).toBe(16);
  });

  it('renders kaleidoscope symbols', () => {
    const { container } = render(<RomanticAnimation onComplete={() => {}} />);
    const kaleidoscopeSymbols = container.querySelectorAll('.kaleidoscope-symbol');
    expect(kaleidoscopeSymbols.length).toBe(24);
  });

  it('renders SVG symbols', () => {
    const { container } = render(<RomanticAnimation onComplete={() => {}} />);
    const svgIcons = container.querySelectorAll('.symbol-icon');
    expect(svgIcons.length).toBeGreaterThan(0);
  });
});
