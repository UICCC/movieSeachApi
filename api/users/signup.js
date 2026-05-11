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

  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  try {
    const existingUser = await User.findOne({ Email: email });
    if (existingUser) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      Name: name,
      Email: email,
      Password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Signup failed' });
  }
}