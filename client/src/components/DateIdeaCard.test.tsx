import { render, screen, fireEvent } from '@testing-library/react';
import DateIdeaCard from './DateIdeaCard';
import type { DateIdea } from '@shared/types';

describe('DateIdeaCard', () => {
  const mockIdea: DateIdea = {
    id: '1',
    idea: 'Take a long walk',
    lastShown: null,
    lastCompleted: null
  };

  const mockOnSelect = jest.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  it('renders the idea text', () => {
    render(<DateIdeaCard idea={mockIdea} onSelect={mockOnSelect} />);
    expect(screen.getByText('Take a long walk')).toBeInTheDocument();
  });

  it('renders the select button', () => {
    render(<DateIdeaCard idea={mockIdea} onSelect={mockOnSelect} />);
    expect(screen.getByText('Choose This!')).toBeInTheDocument();
  });

  it('calls onSelect with idea id when button is clicked', () => {
    render(<DateIdeaCard idea={mockIdea} onSelect={mockOnSelect} />);
    const button = screen.getByText('Choose This!');
    fireEvent.click(button);
    expect(mockOnSelect).toHaveBeenCalledWith('1');
  });

  it('disables button when disabled prop is true', () => {
    render(<DateIdeaCard idea={mockIdea} onSelect={mockOnSelect} disabled={true} />);
    const button = screen.getByText('Choose This!');
    expect(button).toBeDisabled();
  });
});
