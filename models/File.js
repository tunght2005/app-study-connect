const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true }, // ID nhóm học
    fileName: { type: String, required: true }, // Tên file
    filePath: { type: String, required: true }, // Đường dẫn file
    uploadedAt: { type: Date, default: Date.now }, // Thời gian upload
});

module.exports = mongoose.model('File', fileSchema);