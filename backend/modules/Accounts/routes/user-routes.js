const express = require("express");
const router = express.Router();
const User = require("../models/user-models");

router.post("/signup", async (req, res) => {
    const data = req.body || {};
    const name = data.name || data.Name;
    const email = data.email || data.Email;

    if (!name || !email) {
        return res.status(400).json({ error: 'name and email are required' });
    }

    try {
        const newUser = new User({ Name: name, Email: email });
        await newUser.save();

        return res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Signup failed" });
    }
});

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
