const mongoose = require("mongoose");

// 1️⃣ Define the schema
const accountSchema = new mongoose.Schema({

    Name: { type: String, required: true },
    Email: { type: String, required: true, unique: true }
});

// 2️⃣ Create the model from the schema
const Account = mongoose.model("Account", accountSchema);

// 3️⃣ Export the model
module.exports = Account;
