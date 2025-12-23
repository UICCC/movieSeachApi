const express = require("express");
const router = express.Router();
const User = require("../models/user-models");
const bcrypt = require ('bcrypt');



// SIGNUP
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required" });
  }

  try {
    const existingUser = await User.findOne({ Email: email });
    if (existingUser) return res.status(400).json({ error: "Email already exists" });

   console.log("Password before hashing:", password);
const hashedPassword = await bcrypt.hash(password, 10);
console.log("Hashed password:", hashedPassword);

    const newUser = new User({
      Name: name,
      Email: email,
      Password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Signup failed" });
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ Email: email });

    if (!user) return res.status(404).json({ error: "User not found" });
    const isMatch = await bcrypt.compare(password, user.Password)
    if(!isMatch) { 
      return res.status(401).json({ error:" password is wrong"})
    }


    res.json({ message: "Login successful", user: { name: user.Name, email: user.Email } });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// GET all users (optional)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

module.exports = router;
