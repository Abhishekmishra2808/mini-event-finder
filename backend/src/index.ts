import express from 'express';
import cors from 'cors';
import eventRoutes from './routes/events';

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration for development and production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://mini-event-finder-web.onrender.com', // Replace with your actual Render frontend URL
        /\.onrender\.com$/ // Allow all Render subdomains during testing
      ]
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/events', eventRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Mini Event Finder API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║                                                            ║');
  console.log('║            🎉  Mini Event Finder API Server  🎉            ║');
  console.log('║                                                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  console.log(`🚀 Server Status:    RUNNING`);
  console.log(`🌐 Server URL:       http://localhost:${PORT}`);
  console.log(`📍 API Endpoint:     http://localhost:${PORT}/api/events`);
  console.log(`💚 Health Check:     http://localhost:${PORT}/health`);
  console.log(`📊 Sample Events:    10 events pre-loaded`);
  console.log(`\n⏰ Started at:       ${new Date().toLocaleString()}`);
  console.log(`\n💡 Tip: Use Ctrl+C to stop the server\n`);
});
