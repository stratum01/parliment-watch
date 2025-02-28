const express = require('express');
const path = require('path');
const cors = require('cors');

// Import routes
const billsRouter = require('./routes/bills');
const votesRouter = require('./routes/votes');
const membersRouter = require('./routes/members');
const proxyRouter = require('./routes/proxy');

const app = express();

// Enable CORS for development
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// API routes
app.use('/api', billsRouter);
app.use('/api', votesRouter);
app.use('/api', membersRouter);
app.use('/api', proxyRouter);

// Serve static files from the frontend
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

app.get('/health.html', (req, res) => {
  res.send('<!DOCTYPE html><html><head><title>Health Check</title></head><body><p>OK</p></body></html>');
});

// Handle SPA routing - serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;