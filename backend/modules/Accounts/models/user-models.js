const mongoose = require("mongoose");

// 1️⃣ Define the schema
const accountSchema = new mongoose.Schema({

    Name: { type: String, required: true },
    Email: { type: String, required: true, unique: true, lowercase: true,  // Convert to lowercase
    trim: true,       // Remove whitespace
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'] },
    Password: {
    type: String,
    required: true
  }
    
});

// 2️⃣ Create the model from the schema
const User = mongoose.model("Account", accountSchema);

// 3️⃣ Export the model
module.exports = User;
