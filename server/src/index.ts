import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import ideasRouter from './routes/ideas.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/ideas', ideasRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Serve static files in production
if (isProduction) {
  // Path to the built client files (from dist/server/src to dist/client)
  const clientPath = path.join(__dirname, '..', '..', 'client');

  app.use(express.static(clientPath));

  // Handle client-side routing - send index.html for all non-API routes
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${isProduction ? 'production' : 'development'}`);
  if (isProduction) {
    console.log(`Serving static files from: ${path.join(__dirname, '..', '..', 'client')}`);
  }
});

export default app;
