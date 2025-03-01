const nodemailer = require('nodemailer');


module.exports.sendMail = (email, otp) => {
    const subject = "Mã OTP xác minh lấy lại mật khẩu"
    const html = `
     <!DOCTYPE html>
     <html lang="en">
     <head>
         <meta charset="UTF-8">
         <meta name="viewport" content="width=device-width, initial-scale=1.0">
         <title>Mã OTP Xác Minh</title>
     </head>
     <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333;">
         <div style="max-width: 600px; margin: 20px auto; background-color: #fff; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
             <header style="background-color: #4CAF50; color: #fff; padding: 20px; text-align: center; font-size: 20px; font-weight: bold;">
                 Mã OTP Xác Minh
             </header>
             <main style="padding: 20px;">
                 <p>Xin chào,</p>
                 <p>Bạn đã yêu cầu lấy đăng kí cho tài khoản của mình. Vui lòng sử dụng mã OTP dưới đây để xác minh:</p>
                 <div style="margin: 20px 0; text-align: center;">
                     <span style="font-size: 24px; font-weight: bold; color: #4CAF50; border: 1px dashed #4CAF50; padding: 10px 20px; border-radius: 5px; background-color: #f9f9f9;">
                         ${otp}
                     </span>
                 </div>
                 <p>Lưu ý: Mã OTP này chỉ có hiệu lực trong 3 phút. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
             </main>
             <footer style="background-color: #f4f4f4; text-align: center; padding: 15px; font-size: 12px; color: #777;">
                 Nếu bạn không yêu cầu đổi mật khẩu, vui lòng bỏ qua email này. <br>
                 &copy; 2025 Công ty của bạn. Mọi quyền được bảo lưu.
             </footer>
         </div>
     </body>
     </html>
     `;


    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        html: html
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error){
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}