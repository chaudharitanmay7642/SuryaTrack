import express from 'express';
import cors from 'cors';
import calculatorRouter from './routes/calculator.js';
import statesRouter from './routes/states.js';
import policiesRouter from './routes/policies.js';
import grievanceRouter from './routes/grievance.js';
import aiRouter from './routes/ai.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/calculator', calculatorRouter);
app.use('/api/states', statesRouter);
app.use('/api/policies', policiesRouter);
app.use('/api/grievance', grievanceRouter);
app.use('/api/ai', aiRouter);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'SuryaTrack Backend API',
    version: '2.4.0',
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to SuryaTrack Backend API',
    docs: {
      health: 'GET /api/health',
      calculator: 'POST /api/calculator/estimate',
      states: 'GET /api/states',
      stateDetails: 'GET /api/states/:id',
      policyUpdates: 'GET /api/policies/updates',
      policyTimeline: 'GET /api/policies/timeline',
      policyCompare: 'GET /api/policies/compare',
      checkRules: 'GET /api/policies/check-rules?state=MH&applicationDate=YYYY-MM-DD',
      grievanceReasons: 'GET /api/grievance/reasons',
      submitClaim: 'POST /api/grievance/claim',
      trackClaim: 'GET /api/grievance/track/:query',
      aiChat: 'POST /api/ai/chat'
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

app.listen(PORT, () => {
  console.log(`SuryaTrack backend running at http://localhost:${PORT}`);
});
