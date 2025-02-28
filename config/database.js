const mongoose = require('mongoose'); // thêm thư viện mongoose

module.exports.connect = async () => {
    try {
        await mongoose.connect( process.env.MONGO_URL); // kết nối với database và nhúng từ file env để bảo mật
        console.log("Connect Success")
    } catch (error) {
        console.log("Connect Error")
    }
}