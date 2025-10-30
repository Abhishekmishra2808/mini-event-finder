import express from 'express';
import cors from 'cors';
import eventRoutes from '../src/routes/events';

const app = express();

// CORS configuration for development and production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        process.env.FRONTEND_URL || 'https://mini-event-finder.vercel.app',
        /\.vercel\.app$/ // Allow all Vercel preview deployments
      ]
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Mini Event Finder API is running',
    endpoints: {
      health: '/api/health',
      events: '/api/events'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Mini Event Finder API is running' });
});

// Routes
app.use('/api/events', eventRoutes);

// Export for Vercel serverless
export default app;
