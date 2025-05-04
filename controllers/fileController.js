const File = require('../models/File');
const fs = require('fs');
const path = require('path');

// Upload file
exports.uploadFile = async (req, res) => {
    try {
        const { groupId } = req.params;

        // Tạo và lưu file vào MongoDB
        const file = new File({
            groupId,
            fileName: req.file.originalname,
            filePath: req.file.path,
        });
        await file.save(); // Lưu vào MongoDB

        res.status(201).json({ success: true, message: 'File uploaded!', data: file });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy danh sách file
exports.getFiles = async (req, res) => {
    try {
        const { groupId } = req.params;
        const files = await File.find({ groupId });

        res.status(200).json({ success: true, files });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Xóa file
exports.deleteFile = async (req, res) => {
    try {
        const { fileId } = req.params;

        const file = await File.findByIdAndDelete(fileId);
        if (!file) {
            return res.status(404).json({ success: false, message: 'File not found!' });
        }

        // Xóa file khỏi hệ thống
        fs.unlinkSync(file.filePath);

        res.status(200).json({ success: true, message: 'File deleted!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};