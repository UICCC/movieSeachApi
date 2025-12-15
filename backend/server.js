const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

// Auth routes
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  // Add your login logic here
  res.json({ message: 'Login endpoint', email });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});