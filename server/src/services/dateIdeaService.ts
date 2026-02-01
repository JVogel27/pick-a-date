import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import type { DateIdea, DateIdeaData } from '../../../shared/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, '../data/date-ideas.json');
const TEMPLATE_FILE = path.join(__dirname, '../data/date-ideas-template.json');

export class DateIdeaService {
  private async ensureDataFile(): Promise<void> {
    try {
      await fs.access(DATA_FILE);
    } catch {
      // File doesn't exist, copy from template
      const template = await fs.readFile(TEMPLATE_FILE, 'utf-8');
      await fs.writeFile(DATA_FILE, template, 'utf-8');
    }
  }

  private async readData(): Promise<DateIdeaData> {
    await this.ensureDataFile();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  }

  private async writeData(data: DateIdeaData): Promise<void> {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  }

  async getAllIdeas(): Promise<DateIdea[]> {
    const data = await this.readData();
    return data.ideas;
  }

  async getIdeaById(id: string): Promise<DateIdea | null> {
    const data = await this.readData();
    return data.ideas.find(idea => idea.id === id) || null;
  }

  async pickThreeIdeas(): Promise<DateIdea[]> {
    const data = await this.readData();
    const ideas = data.ideas;

    // Categorize ideas
    const neverCompleted = ideas.filter(idea => !idea.lastCompleted);
    const neverShown = neverCompleted.filter(idea => !idea.lastShown);
    const shown = neverCompleted.filter(idea => idea.lastShown);

    // Sort shown ideas by lastShown (oldest first)
    shown.sort((a, b) => {
      if (!a.lastShown) return 1;
      if (!b.lastShown) return -1;
      return new Date(a.lastShown).getTime() - new Date(b.lastShown).getTime();
    });

    // Build the pool: prioritize never shown, then least recently shown
    const pool = [...neverShown, ...shown];

    // If we have fewer than 3 ideas available, throw error
    if (pool.length < 3) {
      throw new Error('Not enough ideas available. Please reset or add more ideas.');
    }

    // Pick 3 random ideas from the pool
    const selected: DateIdea[] = [];
    const poolCopy = [...pool];

    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * poolCopy.length);
      selected.push(poolCopy[randomIndex]);
      poolCopy.splice(randomIndex, 1);
    }

    // Update lastShown for selected ideas
    const now = new Date().toISOString();
    selected.forEach(selectedIdea => {
      const idea = ideas.find(i => i.id === selectedIdea.id);
      if (idea) {
        idea.lastShown = now;
      }
    });

    await this.writeData(data);
    return selected;
  }

  async selectIdea(id: string): Promise<DateIdea> {
    const data = await this.readData();
    const idea = data.ideas.find(i => i.id === id);

    if (!idea) {
      throw new Error('Idea not found');
    }

    idea.lastCompleted = new Date().toISOString();
    await this.writeData(data);
    return idea;
  }

  async createIdea(ideaText: string): Promise<DateIdea> {
    const data = await this.readData();

    // Generate new ID
    const maxId = Math.max(...data.ideas.map(i => parseInt(i.id)), 0);
    const newId = (maxId + 1).toString();

    const newIdea: DateIdea = {
      id: newId,
      idea: ideaText,
      lastShown: null,
      lastCompleted: null
    };

    data.ideas.push(newIdea);
    await this.writeData(data);
    return newIdea;
  }

  async updateIdea(id: string, ideaText: string): Promise<DateIdea> {
    const data = await this.readData();
    const idea = data.ideas.find(i => i.id === id);

    if (!idea) {
      throw new Error('Idea not found');
    }

    idea.idea = ideaText;
    await this.writeData(data);
    return idea;
  }

  async deleteIdea(id: string): Promise<void> {
    const data = await this.readData();
    const index = data.ideas.findIndex(i => i.id === id);

    if (index === -1) {
      throw new Error('Idea not found');
    }

    data.ideas.splice(index, 1);
    await this.writeData(data);
  }

  async reset(): Promise<void> {
    const data = await this.readData();

    // Reset all tracking data
    data.ideas.forEach(idea => {
      idea.lastShown = null;
      idea.lastCompleted = null;
    });

    await this.writeData(data);
  }
}
