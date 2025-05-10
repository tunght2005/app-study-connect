import Message from '../models/Message.js';

// API: Lấy tất cả tin nhắn của 1 group
export const getGroupMessages = async (req, res) => {
  const { groupId } = req.params;

  try {
    const messages = await Message.find({ groupId }).sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi khi lấy tin nhắn nhóm' });
  }
};

// Socket handler: Lưu tin nhắn khi gửi qua socket
export const handleSocketMessage = async (io, socket) => {
  socket.on('send-group-message', async ({ groupId, senderId, content }) => {
    try {
      const newMessage = await Message.create({ groupId, senderId, content });

      io.to(groupId).emit('group-message', {
        _id: newMessage._id,
        groupId,
        senderId,
        content,
        timestamp: newMessage.timestamp,
      });
    } catch (err) {
      console.error('Lỗi khi lưu tin nhắn:', err);
    }
  });
};
