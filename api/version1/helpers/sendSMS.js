const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken); 

module.exports.sendSMS = async (req, res) => {
  try {
    const message = await client.messages.create({
      body: 'Hello from Twilio',
      to: req.body.phone, // Số điện thoại nhận tin nhắn
      from: '+19896834446', // Số Twilio hợp lệ
    });

    console.log("SMS sent:", message.sid);
    res.json({ success: true, message: "OTP đã được gửi!" });
  } catch (error) {
    console.error("Lỗi gửi SMS:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
