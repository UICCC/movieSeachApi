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

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/yourDatabaseName';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err && err.message ? err.message : err));

// -------- Import and Mount User Routes --------
// This replaces the inline userRouter code that was here
const userRouter = require('./modules/Accounts/routes/user-routes'); // Adjust this path to match your router file location
app.use('/api/users', userRouter);

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

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});