import express from 'express'
import upload from '~/middlewares/upload.js'
import Message from '~/models/messageModel.js'

const router = express.Router()

// Gửi tin nhắn (có thể kèm file)
router.post('/send', upload.single('file'), async (req, res) => {
  console.log('req.body:', req.body)
  console.log('req.file:', req.file)

  const { sender, recipient, content } = req.body
  const file = req.file

  const newMessage = new Message({
    sender,
    recipient,
    content,
    fileUrl: file ? `/uploads/${req.file.filename}` : null,
    fileName: file ? req.file.originalname : null
  })

  await newMessage.save()
  res.status(201).json(newMessage)
})

// Gửi tin nhắn trong nhóm
router.post('/group/send', upload.single('file'), async (req, res) => {
  console.log('req.body:', req.body);
  console.log('req.file:', req.file);

  const { sender, groupId, content } = req.body;
  const file = req.file;

  if (!groupId) {
    return res.status(400).json({ message: 'groupId là bắt buộc.' });
  }

  const newMessage = new Message({
    sender,
    groupId,
    content,
    fileUrl: file ? `/uploads/${req.file.filename}` : null,
    fileName: file ? req.file.originalname : null
  });

  await newMessage.save();
  res.status(201).json(newMessage);
});

// Lấy toàn bộ tin nhắn giữa 2 người
router.get('/conversation/:user1/:user2', async (req, res) => {
  const { user1, user2 } = req.params

  const messages = await Message.find({
    $or: [
      { sender: user1, recipient: user2 },
      { sender: user2, recipient: user1 }
    ]
  }).sort({ createdAt: 1 })

  res.json(messages)
})

// Lấy toàn bộ tin nhắn trong nhóm
// router.get('/group/conversation/:groupId', async (req, res) => {
//   const { groupId } = req.params;
//   console.log('Fetching messages for groupId:', groupId);

//   try {
//     const messages = await Message.find({ groupId }).sort({ createdAt: 1 });
//     console.log('Messages:', messages);

//     if (!messages || messages.length === 0) {
//       return res.status(404).json({ message: 'Không tìm thấy tin nhắn trong nhóm.' });
//     }

//     res.json(messages);
//   } catch (error) {
//     console.error('Error fetching group messages:', error);
//     res.status(500).json({ message: 'Lỗi server khi lấy tin nhắn trong nhóm.' });
//   }
// });
// Lấy tin nhắn nhóm
router.get('/group/conversation/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;
   const messages = await Message.find({ groupId })
  .sort({ timestamp: 1 })
  .populate('sender', 'name avatar') // thêm dòng này
    res.json(messages);
  } catch (error) {
    console.error('Lỗi khi lấy tin nhắn nhóm:', error)
    res.status(500).json({ message: 'Không thể lấy tin nhắn nhóm.' });
  }
})
export default router