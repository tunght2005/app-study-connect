import express from 'express'
import User from '~/models/userModel.js'
import Message from '~/models/messageModel.js'
import Group from '~/models/groupModel.js'

const router = express.Router()

router.get('/users', async (req, res) => {
  const users = await User.find()
  res.json(users)
})

router.get('/messages/:conversationId', async (req, res) => {
  const messages = await Message.find({ conversationId: req.params.conversationId })
  res.json(messages)
})

router.get('/groups', async (req, res) => {
  const groups = await Group.find()
  res.json(groups)
})

export default router
