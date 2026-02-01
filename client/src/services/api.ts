import type { DateIdea, PickedIdeas } from '@shared/types';

const API_BASE = '/api';

export const api = {
  async getAllIdeas(): Promise<DateIdea[]> {
    const response = await fetch(`${API_BASE}/ideas`);
    if (!response.ok) throw new Error('Failed to fetch ideas');
    return response.json();
  },

  async pickThreeIdeas(): Promise<PickedIdeas> {
    const response = await fetch(`${API_BASE}/ideas/pick`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to pick ideas');
    }
    return response.json();
  },

  async selectIdea(id: string): Promise<DateIdea> {
    const response = await fetch(`${API_BASE}/ideas/${id}/select`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to select idea');
    return response.json();
  },

  async createIdea(idea: string): Promise<DateIdea> {
    const response = await fetch(`${API_BASE}/ideas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idea })
    });
    if (!response.ok) throw new Error('Failed to create idea');
    return response.json();
  },

  async updateIdea(id: string, idea: string): Promise<DateIdea> {
    const response = await fetch(`${API_BASE}/ideas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idea })
    });
    if (!response.ok) throw new Error('Failed to update idea');
    return response.json();
  },

  async deleteIdea(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/ideas/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete idea');
  },

  async reset(): Promise<void> {
    const response = await fetch(`${API_BASE}/ideas/reset`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to reset');
  }
};
