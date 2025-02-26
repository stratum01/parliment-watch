import express from 'express';
import { fetchBills } from '../services/openParliament.js';
import { mockBills } from '../mockData.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Use mock data in development
    if (process.env.NODE_ENV === 'development') {
      return res.json(mockBills);
    }
    
    const bills = await fetchBills(req.query);
    res.json(bills);
  } catch (error) {
    console.error('Error fetching bills:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    // Use mock data in development
    if (process.env.NODE_ENV === 'development') {
      const bill = mockBills.find(b => b.id === req.params.id);
      if (bill) return res.json(bill);
      return res.status(404).json({ error: 'Bill not found' });
    }
    
    const bill = await fetchBills(req.params.id);
    res.json(bill);
  } catch (error) {
    console.error('Error fetching bill:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
