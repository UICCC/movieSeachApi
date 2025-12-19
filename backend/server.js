// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config(); // Load .env variables

// Models
const User = require('./modules/Accounts/models/user-models'); // Make sure path is correct

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

// -------- User Routes --------
app.post('/api/users/signup', (req, res) => {
  const data = req.body;

  if (!data || !data.name || !data.Email) {
    return res.status(400).send("Missing name or email");
  }

  const newUser = new User({ Name: data.name, Email: data.Email });
  
  newUser.save()
    .then(() => res.send("User created successfully"))
    .catch(err => res.status(500).send(err));
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
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

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
