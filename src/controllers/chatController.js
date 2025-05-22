import Message from '../models/messageModel.js'
import Group from '../models/groupModel.js'
import User from '../models/userModel.js'
import path from 'path'

const areFriends = async (userId, friendId) => {
  try {
    const user = await User.findById(userId)
    return user?.friends.includes(friendId) || false
  } catch (error) {
    return false
  }
}

export const sendMessageToFriend = async (req, res) => {
  try {
    const { sender, recipient, content } = req.body
    if (!await areFriends(sender, recipient)) {
      return res.status(403).json({ success: false, message: 'You are not friends' })
    }
    const message = await Message.create({ sender, recipient, content })
    res.status(201).json({ success: true, message: 'Sent', data: message })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// export const getFriendMessages = async (req, res) => {
//   try {
//     const { friendId } = req.params
//     const { userId } = req.query
//     if (!await areFriends(userId, friendId)) {
//       return res.status(403).json({ success: false, message: 'Not friends' })
//     }
//     const messages = await Message.find({
//       $or: [
//         { sender: userId, recipient: friendId },
//         { sender: friendId, recipient: userId }
//       ]
//     }).sort({ timestamp: -1 })
//     res.status(200).json({ success: true, messages })
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message })
//   }
// }
export const getFriendMessages = async (req, res) => {
  try {
    const { friendId } = req.params;
    const { userId } = req.query;
    console.log('Nhận request GET /api/v1/chat/friend:', { friendId, userId });

    if (!await areFriends(userId, friendId)) {
      return res.status(403).json({ success: false, message: 'Not friends' });
    }

    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: friendId },
        { sender: friendId, recipient: userId },
      ],
      content: { $ne: '' }, // ❗️ Chỉ lấy tin nhắn có content khác rỗng
    })
      .populate('sender', 'username') // Populate sender để có username
      .sort({ timestamp: -1 });

    console.log('Tin nhắn trả về:', messages);
    res.status(200).json({ success: true, messages });
  } catch (err) {
    console.error('Lỗi lấy tin nhắn:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const sendMessageToGroup = async (req, res) => {
  try {
    const { sender, groupId, content } = req.body
    const io = req.app.get('io')
    const message = await Message.create({ sender, groupId, content, timestamp: new Date() })
    const populatedMessage = await Message.findById(message._id).populate('sender', 'username avatar')

    // Emit Socket.IO event
    io.to(groupId).emit('newGroupMessage', populatedMessage)

    res.status(201).json({ success: true, message: 'Sent to group', data: populatedMessage })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params
    const messages = await Message.find({ groupId })
      .populate('sender', 'username avatar') // Include avatar
      .sort({ timestamp: -1 })
    const validMessages = messages.filter(
      (msg) => msg.sender && msg.sender.username
    )
    res.status(200).json({ success: true, messages: validMessages })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const deleteFriendMessage = async (req, res) => {
  try {
    const { messageId } = req.params
    const { userId } = req.body
    const message = await Message.findById(messageId)
    if (!message || (message.sender.toString() !== userId && message.recipient.toString() !== userId)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' })
    }
    await Message.findByIdAndDelete(messageId)
    res.status(200).json({ success: true, message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const deleteGroupMessage = async (req, res) => {
  try {
    const { messageId } = req.params
    const { userId } = req.body
    const message = await Message.findById(messageId)
    if (!message || message.sender.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' })
    }
    await Message.findByIdAndDelete(messageId)
    res.status(200).json({ success: true, message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

import multer from 'multer'
const upload = multer({ dest: 'uploads/' })

export const uploadGroupImageMessage = async (req, res) => {
  try {
    const { sender, groupId } = req.body
    const file = req.file
    if (!file) {
      return res.status(400).json({ success: false, message: 'Image is required' })
    }
    const io = req.app.get('io')
    const imageUrl = `/uploads/${file.filename}`
    const message = await Message.create({
      sender,
      groupId,
      imageUrl,
      timestamp: new Date()
    })
    const populatedMessage = await Message.findById(message._id).populate('sender', 'username avatar')

    // Emit Socket.IO event
    io.to(groupId).emit('newGroupMessage', populatedMessage)

    res.status(201).json({ success: true, message: 'Image sent', data: populatedMessage })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const getGroupMembers = async (req, res) => {
  try {
    const { groupId } = req.params
    const group = await Group.findById(groupId).populate('members', 'username avatar')
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' })
    }
    const validMembers = group.members.filter(
      (member) => member && member.username
    )
    res.status(200).json({ success: true, members: validMembers })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const getCurrentUser = async (req, res) => {
  try {
    const { userId } = req.body // Adjust based on auth middleware
    const user = await User.findById(userId).select('username avatar')
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    res.status(200).json({ success: true, user })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}