// sockets/socket.js
import Message from '../models/messageModel.js'
import Group from '../models/groupModel.js'

export const initSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('Người dùng đã kết nối:', socket.id)

    // Join group room
    socket.on('joinGroup', ({ groupId, userId }) => {
      socket.join(groupId)
      console.log(`User ${userId} joined group ${groupId}`)
      // Notify group members update
      io.to(groupId).emit('updateGroupMembers', groupId)
    })

    // Handle new group message
    socket.on('sendGroupMessage', async ({ groupId, sender, content, imageUrl }) => {
      try {
        const message = await Message.create({
          sender,
          groupId,
          content,
          imageUrl,
          timestamp: new Date()
        })
        const populatedMessage = await Message.findById(message._id).populate('sender', 'username avatar')
        io.to(groupId).emit('newGroupMessage', populatedMessage)
      } catch (error) {
        console.error('Error sending group message:', error)
      }
    })

    // Handle group member updates
    socket.on('requestGroupMembers', async (groupId) => {
      try {
        const group = await Group.findById(groupId).populate('members', 'username avatar')
        if (group) {
          io.to(groupId).emit('groupMembersUpdated', group.members)
        }
      } catch (error) {
        console.error('Error fetching group members:', error)
      }
    })

    socket.on('disconnect', () => {
      console.log('Người dùng đã ngắt kết nối:', socket.id)
    })
  })
}