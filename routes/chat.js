const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Route gốc cho /api/chat
router.get('/', (req, res) => {
    res.status(200).json({ success: true, message: 'Chat API is working!' });
});

// Gửi tin nhắn
router.post('/send/:groupId', chatController.sendMessage);

// Lấy danh sách tin nhắn
router.get('/messages/:groupId', chatController.getMessages);

// Chỉnh sửa tin nhắn
router.put('/edit/:messageId', chatController.editMessage);

// Xóa tin nhắn
router.delete('/delete/:messageId', chatController.deleteMessage);

module.exports = router;