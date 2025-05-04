const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb://localhost:27017/studyconnect'); // Loại bỏ các tùy chọn không cần thiết
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Dừng ứng dụng nếu kết nối thất bại
    }
};

module.exports = connectDB;