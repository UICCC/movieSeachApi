// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// Connect to MongoDB
const MONGO_URI = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yourDatabaseName';
const DB_NAME = process.env.DB_NAME || 'movieSearchDB';

mongoose.connect(MONGO_URI, { dbName: DB_NAME })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err && err.message ? err.message : err));

// -------- Import and Mount User Routes --------
const userRouter = require('./modules/Accounts/routes/user-routes');
app.use('/api/users', userRouter);

// -------- Test endpoint --------
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working' });
});

// -------- IMDb API Route --------
app.get('/', async (req, res) => {
  const options = {
    method: 'GET',
    url: 'https://imdb236.p.rapidapi.com/api/imdb/cast/nm0000190/titles',
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': process.env.RAPIDAPI_HOST
    }
  };

  try {
    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching IMDB data:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Global error handler (must be after all routes)
app.use((err, req, res, next) => {
  console.error('❌ Global Error:', err);
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal Server Error',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined 
  });
});

// 404 handler (must be last)
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});