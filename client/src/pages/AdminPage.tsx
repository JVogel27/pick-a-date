import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { DateIdea } from '@shared/types';

const AdminPage: React.FC = () => {
  const [ideas, setIdeas] = useState<DateIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [newIdeaText, setNewIdeaText] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    loadIdeas();
  }, []);

  const loadIdeas = async () => {
    try {
      setLoading(true);
      const data = await api.getAllIdeas();
      setIdeas(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load ideas');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdeaText.trim()) return;

    try {
      await api.createIdea(newIdeaText);
      setNewIdeaText('');
      await loadIdeas();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create idea');
    }
  };

  const handleStartEdit = (idea: DateIdea) => {
    setEditingId(idea.id);
    setEditText(idea.idea);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleSaveEdit = async (id: string) => {
    if (!editText.trim()) return;

    try {
      await api.updateIdea(id, editText);
      setEditingId(null);
      setEditText('');
      await loadIdeas();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update idea');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this idea?')) return;

    try {
      await api.deleteIdea(id);
      await loadIdeas();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete idea');
    }
  };

  const handleReset = async () => {
    try {
      await api.reset();
      setShowResetConfirm(false);
      await loadIdeas();
      alert('Reset successful! All tracking data has been cleared.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset');
    }
  };

  return (
    <div className="admin-page">
      <header className="header">
        <h1 className="title">Manage Date Ideas</h1>
        <Link to="/" className="home-link">
          Back to Home
        </Link>
      </header>

      <main className="main-content">
        {error && <div className="error-message">{error}</div>}

        <section className="add-section">
          <h2>Add New Idea</h2>
          <form onSubmit={handleCreate} className="add-form">
            <input
              type="text"
              value={newIdeaText}
              onChange={(e) => setNewIdeaText(e.target.value)}
              placeholder="Enter a new date idea..."
              className="idea-input"
            />
            <button type="submit" className="add-button">
              Add Idea
            </button>
          </form>
        </section>

        <section className="reset-section">
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="reset-button"
            >
              Reset All Tracking
            </button>
          ) : (
            <div className="reset-confirm">
              <p>Are you sure? This will clear all "shown" and "completed" tracking.</p>
              <button onClick={handleReset} className="confirm-button">
                Yes, Reset
              </button>
              <button onClick={() => setShowResetConfirm(false)} className="cancel-button">
                Cancel
              </button>
            </div>
          )}
        </section>

        <section className="ideas-section">
          <h2>All Ideas ({ideas.length})</h2>
          {loading ? (
            <p className="loading">Loading...</p>
          ) : (
            <div className="ideas-list">
              {ideas.map((idea) => (
                <div key={idea.id} className="idea-item">
                  {editingId === idea.id ? (
                    <div className="edit-mode">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="edit-input"
                      />
                      <button
                        onClick={() => handleSaveEdit(idea.id)}
                        className="save-button"
                      >
                        Save
                      </button>
                      <button onClick={handleCancelEdit} className="cancel-button">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="view-mode">
                      <p className="idea-text">{idea.idea}</p>
                      <div className="idea-meta">
                        {idea.lastCompleted && (
                          <span className="completed-badge">✓ Completed</span>
                        )}
                        {idea.lastShown && (
                          <span className="shown-badge">
                            Shown {new Date(idea.lastShown).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <div className="idea-actions">
                        <button
                          onClick={() => handleStartEdit(idea)}
                          className="edit-button"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(idea.id)}
                          className="delete-button"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminPage;
