const express = require('express') // thêm thư viện express
require("dotenv").config(); // sử dụng thư viện dotenv để cấu hình các thông tin bảo mật
const database = require("./config/database.js") // Nhúng từ bên file config cấu hình database
const bodyParser = require('body-parser') // Thư viện lấy dữ liệu từ các biểu mẫu (forms) trong các yêu cầu HTTP.

database.connect() // gọi hàm connect để connect

const app = express() // Gọi hàm express() để khởi tạo một ứng dụng Express
const port = process.env.PORT // Cổng 3000
const routeApi = require('./api/version1/routes/index.route.js') // Nhúng route client


app.set("views", `${__dirname}/views`); // cài đặt chế độ hiển thị của pug trong thư mục views
app.set("view engine", "pug"); // cài đặt template engine là pug

app.use(express.static(`${__dirname}/public`)); // Nhúng file tĩnh có tên folder public
// parse application/json gửi data json qua body
app.use(bodyParser.json())

// route
routeApi(app)

// Cấu hình server để lắng nghe tất cả địa chỉ IP
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${port}`);
});