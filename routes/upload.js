const express = require('express');
const router = express.Router();
const multer = require('multer');
const fileController = require('../controllers/fileController');

// Route gốc cho /api/upload
router.get('/', (req, res) => {
    res.status(200).json({ success: true, message: 'Upload API is working!' });
});

// Cấu hình multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Thư mục lưu file
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Đặt tên file
    },
});
const upload = multer({ storage });

// Upload file
router.post('/:groupId/upload', upload.single('File'), fileController.uploadFile);

// Lấy danh sách file
router.get('/:groupId/files', fileController.getFiles);

// Xóa file
router.delete('/file/:fileId', fileController.deleteFile);

module.exports = router;