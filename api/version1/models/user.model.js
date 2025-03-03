const mongoose = require('mongoose'); 

const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    phone: String,
    password: String,
    token:  String,
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


