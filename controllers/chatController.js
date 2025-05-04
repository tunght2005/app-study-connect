const Message = require('../models/Message');

// Gửi tin nhắn
exports.sendMessage = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { sender, content } = req.body;

        const message = new Message({ groupId, sender, content });
        await message.save();

        res.status(201).json({ success: true, message: 'Message sent!', data: message });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy danh sách tin nhắn
exports.getMessages = async (req, res) => {
    try {
        const { groupId } = req.params;

        const messages = await Message.find({ groupId }).sort({ createdAt: 1 }); // Sắp xếp theo thời gian
        res.status(200).json({ success: true, messages });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Xóa tin nhắn
exports.deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;

        const message = await Message.findByIdAndDelete(messageId);
        if (!message) {
            return res.status(404).json({ success: false, message: 'Message not found!' });
        }

        res.status(200).json({ success: true, message: 'Message deleted!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.editMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { content } = req.body;

        // Tìm và cập nhật tin nhắn
        const message = await Message.findByIdAndUpdate(
            messageId,
            { content },
            { new: true } // Trả về tài liệu đã cập nhật
        );

        if (!message) {
            return res.status(404).json({ success: false, message: 'Message not found!' });
        }

        res.status(200).json({ success: true, message: 'Message updated!', data: message });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};