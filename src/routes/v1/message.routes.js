import express from 'express'
import Message from '~/models/messageModel.js'

const router = express.Router()

// POST: Gửi tin nhắn
router.post('/', async (req, res) => {
  try {
    const { sender, recipient, content, conversationId, groupId } = req.body

    const message = await Message.create({
      sender,
      recipient,
      content,
      conversationId,
      groupId
    })

    res.status(201).json({ message: 'Message sent successfully', data: message })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET: Lấy tin nhắn giữa hai user
router.get('/', async (req, res) => {
  try {
    const { user1, user2 } = req.query
    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 }
      ]
    }).sort({ timestamp: 1 })

    res.json(messages)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
