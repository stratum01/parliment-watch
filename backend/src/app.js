import express from 'express';
import cors from 'cors';
import votesRouter from './routes/votes.js';
import billsRouter from './routes/bills.js';
import membersRouter from './routes/members.js';

const app = express();

// Configure CORS to allow requests from your Fly.io domain
app.use(cors({
  origin: ['https://parliament-watch.fly.dev', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Health check endpoint for Fly.io
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', service: 'backend' });
});

// API routes
app.use('/api/votes', votesRouter);
app.use('/api/bills', billsRouter);
app.use('/api/members', membersRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});