import express from 'express';
import { DateIdeaService } from '../services/dateIdeaService.js';

const router = express.Router();
const service = new DateIdeaService();

// Get all ideas (for admin page)
router.get('/', async (req, res) => {
  try {
    const ideas = await service.getAllIdeas();
    res.json(ideas);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ideas' });
  }
});

// Pick 3 random ideas
router.get('/pick', async (req, res) => {
  try {
    const ideas = await service.pickThreeIdeas();
    res.json({ ideas });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to pick ideas';
    res.status(500).json({ error: message });
  }
});

// Select an idea (mark as completed)
router.post('/:id/select', async (req, res) => {
  try {
    const idea = await service.selectIdea(req.params.id);
    res.json(idea);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to select idea';
    res.status(404).json({ error: message });
  }
});

// Create new idea
router.post('/', async (req, res) => {
  try {
    const { idea } = req.body;
    if (!idea || typeof idea !== 'string' || idea.trim().length === 0) {
      return res.status(400).json({ error: 'Idea text is required' });
    }
    const newIdea = await service.createIdea(idea.trim());
    res.status(201).json(newIdea);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create idea' });
  }
});

// Update idea
router.put('/:id', async (req, res) => {
  try {
    const { idea } = req.body;
    if (!idea || typeof idea !== 'string' || idea.trim().length === 0) {
      return res.status(400).json({ error: 'Idea text is required' });
    }
    const updatedIdea = await service.updateIdea(req.params.id, idea.trim());
    res.json(updatedIdea);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update idea';
    res.status(404).json({ error: message });
  }
});

// Delete idea
router.delete('/:id', async (req, res) => {
  try {
    await service.deleteIdea(req.params.id);
    res.status(204).send();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete idea';
    res.status(404).json({ error: message });
  }
});

// Reset all tracking data
router.post('/reset', async (req, res) => {
  try {
    await service.reset();
    res.json({ message: 'Reset successful' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset' });
  }
});

export default router;
