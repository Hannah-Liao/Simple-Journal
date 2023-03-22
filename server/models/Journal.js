const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema({
    user: {
        type: String,
        ref: "user"
    },
    title: {
        type: String,
        // required: true
    },
    body: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now()
    }
});


module.exports = mongoose.model("Journal", journalSchema);