const User = require('../models/user.model.js')
const OTP = require('../models/otp.model.js')
const bcrypt = require("bcrypt");


// Helpers
const generateHelper = require('../helpers/generate.js');
const sendOtpHelper = require('../helpers/sendSMS.js');
const sendMailHelper = require('../helpers/sendMail.js');


// [POST] api/v1/users/register
module.exports.register = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      password
    } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Kiểm tra email đã tồn tại chưa
    const existEmail = await User.findOne({
      email: email,
      deleted: false
    });
    if (existEmail) {
      return res.json({
        code: 400,
        message: "Email đã tồn tại!"
      });
    }

    // Sinh OTP và lưu vào DB
    const otp = generateHelper.generateOTP();
    await OTP.create({
      phone,
      otp
    });

    // Gửi SMS
    // await sendOtpHelper.sendSMS(req, res);

    // tạo user
    const user = new User({
      fullName,
      email,
      phone,
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
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi"
    });
  }
};

// [POST] api/v1/users/login
module.exports.login = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;

    // Kiểm tra email đã tồn tại chưa
    const user = await User.findOne({
      email: email,
      deleted: false
    });
    if (!user) {
      return res.json({
        code: 400,
        message: "Email không tồn tại!"
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu không đúng!"
      });
    }

    const token = user.token;
    res.cookie("token", token);

    res.json({
      code: 200,
      message: "Đăng nhập thành công !",
      token: token
    })

  } catch (error) {
    console.error("Lỗi đăng nhập:", error.message);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi"
    });
  }
};

// [POST] api/v1/users/password/forgot
module.exports.forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;

     // Kiểm tra email đã tồn tại chưa
     const existEmail = await User.findOne({
      email: email,
      deleted: false
    });
    if (!existEmail) {
      return res.json({
        code: 400,
        message: "Email không tồn tại!"
      });
    }

    // Sinh OTP và lưu vào DB
    const otp = generateHelper.generateOTP(6);

    await OTP.create({
      email,
      otp,
      createdAt: Date.now() + 100 // 3 phút hết hạn
    });

    // Gửi Email
    sendMailHelper.sendMail(email, otp);

    res.status(200).json({
      code: 200,
      message: "Xác thực thực thành công"
    });

  } catch (error) {
    console.error("Lỗi xác thực:", error.message);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi"
    });
  }
};

// [POST] api/v1/users/password/otp
module.exports.otpPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const otp = req.body.otp;

    // Tìm OTP theo email
    const otpRecord = await OTP.findOne({ email: email });

    if (!otpRecord) {
      return res.status(400).json({
        code: 400,
        message: "Mã OTP đã hết hạn"
      });
    }

    const result = await OTP.findOne({email: email, otp: otp});
    if (!result){
      return res.status(400).json({
        code: 400,
        message: "OTP không hợp lệ"
      });
    }
    
    // Xóa OTP trước
    await OTP.deleteOne({
        email: email,
        otp: otp
    });
    const user = await User.findOne({email: email});
    const token = user.token;
    res.cookie("token", token);

    res.status(200).json({
      code: 200,
      message: "Xác thực thực thành công",
      token: token
    });

  } catch (error) {
    console.error("Lỗi xác thực:", error.message);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi"
    });
  }
};

// [POST] api/v1/users/password/reset
module.exports.resetPassword = async (req, res) => {
  try {
    const token = req.cookies.token;
    const password = req.body.password;

    const user = await User.findOne({ token});

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return res.status(400).json({
        code: 400,
        message: "Vui lòng không đổi mật khẩu như cũ"
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await User.updateOne(
      {token: token},
      {password: hashedPassword}
    );

    res.status(200).json({
      code: 200,
      message: "Đổi mật khẩu thành công",
    });

  } catch (error) {
    console.error("Lỗi đổi mật khẩu:", error.message);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi"
    });
  }
};

// [POST] api/v1/users/detail
module.exports.detail = async (req, res) => {
  try {
    const token = req.cookies.token;
    const user = await User.findOne({ 
      token: token,
      deleted: false
    }).select("-password -token");

    res.status(200).json({
      code: 200,
      message: "Thành công",
      info: user
    });

  } catch (error) {
    console.error("Lỗi", error.message);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi"
    });
  }
};