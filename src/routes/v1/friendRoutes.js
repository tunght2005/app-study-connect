// routes/v1/friendRoutes.js
import express from 'express'
import FriendRequest from '~/models/friendRequestModel.js'
import Friend from '~/models/friendModel.js'
// import User from '~/models/userModel.js'
import mongoose from 'mongoose'


const router = express.Router()

// Gửi lời mời kết bạn
router.post('/request', async (req, res) => {
  const { senderId, recipientId } = req.body

  if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(recipientId)) {
    return res.status(400).json({ error: 'ID không hợp lệ' })
  }

  if (senderId === recipientId) {
    return res.status(400).json({ error: 'Không thể tự gửi lời mời kết bạn' })
  }

  const existing = await FriendRequest.findOne({ sender: senderId, recipient: recipientId })
  if (existing) return res.status(400).json({ error: 'Đã gửi lời mời trước đó' })

  const request = await FriendRequest.create({ sender: senderId, recipient: recipientId })
  res.status(201).json(request)
})

// Lấy danh sách lời mời đến (cho user)
router.get('/requests/:userId', async (req, res) => {
  const requests = await FriendRequest.find({ recipient: req.params.userId, status: 'pending' })
    .populate('sender', 'username email')
  res.json(requests)
})

// Chấp nhận lời mời
router.post('/accept', async (req, res) => {
  const { requestId } = req.body

  const request = await FriendRequest.findById(requestId)
  // eslint-disable-next-line no-console
  console.log('Request:', request)

  if (!request || request.status !== 'pending') return res.status(400).json({ error: 'Lời mời không hợp lệ' })

  request.status = 'accepted'
  await request.save()

  await Friend.create({ senderId: request.sender, recipientId: request.recipient })

  res.json({ message: 'Đã chấp nhận kết bạn' })
})

// Từ chối lời mời
router.post('/reject', async (req, res) => {
  const { requestId } = req.body
  const request = await FriendRequest.findById(requestId)
  if (!request || request.status !== 'pending') return res.status(400).json({ error: 'Không tìm thấy lời mời' })

  request.status = 'rejected'
  await request.save()
  res.json({ message: 'Đã từ chối lời mời' })
})

// Lấy danh sách bạn bè của một user
router.get('/friends/:userId', async (req, res) => {
  const { userId } = req.params
  const friends = await Friend.find({
    $or: [{ user1: userId }, { user2: userId }]
  }).populate('user1 user2', 'username email')

  const result = friends.map(f => {
    const friend = f.user1._id.toString() === userId ? f.user2 : f.user1
    return { id: friend._id, username: friend.username, email: friend.email }
  })

  res.json(result)
})

export default router
