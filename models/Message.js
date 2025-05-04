const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true }, // ID nhóm học
    sender: { type: String, required: true }, // Người gửi
    content: { type: String, required: true }, // Nội dung tin nhắn
    createdAt: { type: Date, default: Date.now }, // Ngày gửi tin nhắn
});

module.exports = mongoose.model('Message', messageSchema);