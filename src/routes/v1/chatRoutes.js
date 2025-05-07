// routes/v1/chatRoutes.js
import express from 'express'
import upload from '~/middlewares/upload.js'
import Message from '~/models/messageModel.js'

const router = express.Router()

// Gửi tin nhắn (có thể kèm file)
router.post('/send', upload.single('file'), async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('req.body:', req.body)
  // eslint-disable-next-line no-console
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

export default router
