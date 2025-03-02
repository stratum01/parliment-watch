const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const { initScheduledJobs } = require('./services/scheduler');

// Import route handlers
const billsRoutes = require('./routes/bills');
const votesRoutes = require('./routes/votes');
const membersRoutes = require('./routes/members');

// Create Express app
const app = express();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/parliament-watch', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Call connectDB and initialize scheduler once connected
connectDB().then(() => {
  // Initialize scheduled jobs after DB connection
  initScheduledJobs();
});

// Middleware
app.use(helmet()); // Set security headers
app.use(compression()); // Compress responses
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request body
app.use(morgan('combined')); // Request logging

// API Routes
app.use('/api/bills', billsRoutes);
app.use('/api/votes', votesRoutes);
app.use('/api/members', membersRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../../frontend/dist')));
  
  // Any routes not matched by API will serve the SPA
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../frontend/dist', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Add this to your app.js temporarily
app.get('/api/admin/refresh-data', async (req, res) => {
  try {
    // Clear existing cache
    await Promise.all([
      Bill.deleteMany({}),
      Vote.deleteMany({}),
      Member.deleteMany({})
    ]);
    
    // Trigger data refresh
    const { updateRecentVotes, updateRecentBills } = require('./services/scheduler');
    await updateRecentVotes();
    await updateRecentBills();
    
    res.json({ success: true, message: 'Cache cleared and refresh triggered' });
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = app;