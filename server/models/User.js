const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    googleId: String,
    displayName: String,
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    profileImage: String,
    createAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model("User", userSchema)