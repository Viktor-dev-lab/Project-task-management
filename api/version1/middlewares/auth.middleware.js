const User = require('../models/user.model.js')

module.exports.requireAuth = async (req,res,next) => {
  if (req.headers.authorization){
    const token = req.headers.authorization.split(" ")[1];
    const user = await User.findOne({
      token: token,
      deleted: false,
    }).select("-password");

    if (!user){
      return res.status(400).json({
        code: 400,
        message: "Token không hợp lệ"
      });
    }

    req.user = user;
    next();
  } else {
    res.status(400).json({
      code: 400,
      message: "Vui lòng gửi token lên"
    });
  }
}