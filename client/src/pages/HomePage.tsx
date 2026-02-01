import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import RomanticAnimation from '../components/RomanticAnimation';
import DateIdeaCard from '../components/DateIdeaCard';
import type { DateIdea } from '@shared/types';

type ViewState = 'initial' | 'animating' | 'showing' | 'selected';

const HomePage: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>('initial');
  const [pickedIdeas, setPickedIdeas] = useState<DateIdea[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handlePickDate = async () => {
    setError('');
    setLoading(true);
    setViewState('animating');
  };

  const handleAnimationComplete = async () => {
    try {
      const result = await api.pickThreeIdeas();
      setPickedIdeas(result.ideas);
      setViewState('showing');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to pick ideas');
      setViewState('initial');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectIdea = async (id: string) => {
    setLoading(true);
    try {
      await api.selectIdea(id);
      setViewState('selected');
      // Reset after 3 seconds
      setTimeout(() => {
        setViewState('initial');
        setPickedIdeas([]);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to select idea');
    } finally {
      setLoading(false);
    }
  };

  const handleTryAgain = () => {
    setViewState('initial');
    setPickedIdeas([]);
    setError('');
  };

  return (
    <div className="home-page">
      <header className="header">
        <h1 className="title">Pick-A-Date</h1>
        <Link to="/admin" className="admin-link">
          Manage Ideas
        </Link>
      </header>

      <main className="main-content">
        {error && (
          <div className="error-message">
            {error}
            <button onClick={handleTryAgain} className="try-again-button">
              Try Again
            </button>
          </div>
        )}

        {viewState === 'initial' && (
          <div className="initial-view">
            <button
              className="pick-button"
              onClick={handlePickDate}
              disabled={loading}
            >
              Pick A Date!
            </button>
          </div>
        )}

        {viewState === 'animating' && (
          <RomanticAnimation onComplete={handleAnimationComplete} />
        )}

        {viewState === 'showing' && (
          <div className="ideas-view">
            <h2 className="subtitle">Choose your date:</h2>
            <div className="ideas-grid">
              {pickedIdeas.map((idea) => (
                <DateIdeaCard
                  key={idea.id}
                  idea={idea}
                  onSelect={handleSelectIdea}
                  disabled={loading}
                />
              ))}
            </div>
          </div>
        )}

        {viewState === 'selected' && (
          <div className="selected-view">
            <h2 className="success-message">Perfect choice! Have fun! 💕</h2>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
