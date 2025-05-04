const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Tên nhóm học
    members: [{ type: String }], // Danh sách thành viên
    createdAt: { type: Date, default: Date.now }, // Ngày tạo nhóm
});

module.exports = mongoose.model('Group', groupSchema);