const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    phone: String,
    otp: String,
    createdAt: { type: Date, default: Date.now, expires: 100 } 
});

const OTP = mongoose.model("OTP", otpSchema, "otp");

module.exports = OTP;