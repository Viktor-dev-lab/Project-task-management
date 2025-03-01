const mongoose = require('mongoose'); 
const generate = require('../helpers/generate.js');

const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    phone: String,
    password: String,
    token: {
        type: String,
        default: generate.generateRandomString(20)
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,
}, {
    timestamps: true
});


const User = new mongoose.model("User", userSchema, "users");

module.exports = User;


