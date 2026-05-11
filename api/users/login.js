const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user-models');

const MONGO_URI = process.env.DB_URL || 'mongodb://127.0.0.1:27017/movieSearchDB';
const DB_NAME = process.env.DB_NAME || 'movieSearchDB';

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URI, { dbName: DB_NAME });
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await connectDB();

  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ Email: email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.Password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Login successful', user: { name: user.Name, email: user.Email } });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Login failed' });
  }
}