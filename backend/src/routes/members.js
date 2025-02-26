import express from 'express';
import { fetchMembers, fetchMemberVotes } from '../services/openParliament.js';
import { mockMembers, mockMemberVotes } from '../mockData.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Use mock data in development
    if (process.env.NODE_ENV === 'development') {
      return res.json(mockMembers);
    }
    
    const members = await fetchMembers(req.query);
    res.json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    // Use mock data in development
    if (process.env.NODE_ENV === 'development') {
      const member = mockMembers.find(m => m.id === req.params.id);
      if (member) return res.json(member);
      return res.status(404).json({ error: 'Member not found' });
    }
    
    const member = await fetchMembers(req.params.id);
    res.json(member);
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/votes', async (req, res) => {
  try {
    // Use mock data in development
    if (process.env.NODE_ENV === 'development') {
      const votes = mockMemberVotes[req.params.id];
      if (votes) return res.json(votes);
      return res.status(404).json({ error: 'Member votes not found' });
    }
    
    const votes = await fetchMemberVotes(req.params.id, req.query);
    res.json(votes);
  } catch (error) {
    console.error('Error fetching member votes:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;