import express from 'express';
import { fetchVotes } from '../services/openParliament.js';
import { mockVotes } from '../mockData.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Use mock data in development
    if (process.env.NODE_ENV === 'development') {
      return res.json(mockVotes);
    }
    
    const votes = await fetchVotes(req.query);
    res.json(votes);
  } catch (error) {
    console.error('Error fetching votes:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
