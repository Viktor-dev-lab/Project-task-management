const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    email: String,
    otp: String,
    createdAt: { type: Date, default: Date.now, expires: 0 } 
});

const OTP = mongoose.model("OTP", otpSchema, "otp");

module.exports = OTP;