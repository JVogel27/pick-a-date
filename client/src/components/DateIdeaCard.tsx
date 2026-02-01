import React from 'react';
import type { DateIdea } from '@shared/types';

interface DateIdeaCardProps {
  idea: DateIdea;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

const DateIdeaCard: React.FC<DateIdeaCardProps> = ({ idea, onSelect, disabled }) => {
  return (
    <div className="date-idea-card">
      <p className="date-idea-text">{idea.idea}</p>
      <button
        className="select-button"
        onClick={() => onSelect(idea.id)}
        disabled={disabled}
      >
        Choose This!
      </button>
    </div>
  );
};

export default DateIdeaCard;
