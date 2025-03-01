const User = require('../models/user.model.js')
const OTP = require('../models/otp.model.js')
const bcrypt = require("bcrypt");


// Helpers
const generateHelper = require('../helpers/generate.js');
const sendOtpHelper = require('../helpers/sendSMS.js');


// [GET] api/v1/users/register
module.exports.register = async (req, res) => {
  try {
    const {fullName, email, phone, password} = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Kiểm tra email đã tồn tại chưa
    const existEmail = await User.findOne({ email: email, deleted: false });
    if (existEmail) {
      return res.json({ code: 400, message: "Email đã tồn tại!" });
    }

    // Sinh OTP và lưu vào DB
    const otp = generateHelper.generateOTP();
    await OTP.create({ phone, otp });

    // Gửi SMS
    // await sendOtpHelper.sendSMS(req, res);

    // tạo user
    const user = new User({
      fullName,
      email, phone, 
      password: hashedPassword
    });
    user.save();

    const token = user.token;
    res.cookie("token", token);

    res.json({
      code: 200,
      message: "Tạo tài khoản thành công !",
      token: token
    })

  } catch (error) {
    console.error("Lỗi đăng ký:", error.message);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
};
