// // sockets/socket.js
// import Message from '../models/messageModel.js'
// import Group from '../models/groupModel.js'

// export const initSocket = (io) => {
//   io.on('connection', (socket) => {
//     console.log('Người dùng đã kết nối:', socket.id)

//     // Join group room
//     socket.on('joinGroup', ({ groupId, userId }) => {
//       socket.join(groupId)
//       console.log(`User ${userId} joined group ${groupId}`)
//       // Notify group members update
//       io.to(groupId).emit('updateGroupMembers', groupId)
//     })

//     // Handle new group message
//     socket.on('sendGroupMessage', async ({ groupId, sender, content, imageUrl }) => {
//       try {
//         const message = await Message.create({
//           sender,
//           groupId,
//           content,
//           imageUrl,
//           timestamp: new Date()
//         })
//         const populatedMessage = await Message.findById(message._id).populate('sender', 'username avatar')
//         io.to(groupId).emit('newGroupMessage', populatedMessage)
//       } catch (error) {
//         console.error('Error sending group message:', error)
//       }
//     })

//     // Handle group member updates
//     socket.on('requestGroupMembers', async (groupId) => {
//       try {
//         const group = await Group.findById(groupId).populate('members', 'username avatar')
//         if (group) {
//           io.to(groupId).emit('groupMembersUpdated', group.members)
//         }
//       } catch (error) {
//         console.error('Error fetching group members:', error)
//       }
//     })

//     socket.on('disconnect', () => {
//       console.log('Người dùng đã ngắt kết nối:', socket.id)
//     })
//   })
// }
// import Message from '../models/messageModel.js';
// import Group from '../models/groupModel.js';

// export const initSocket = (io) => {
//   io.on('connection', (socket) => {
//     console.log('Người dùng đã kết nối:', socket.id);

//     // Assume userId is available from socket.handshake.query or auth
//     const userId = socket.handshake.query.userId;
//     if (!userId) {
//       console.error('No userId provided for socket:', socket.id);
//       return;
//     }

//     // Join private chat room
//     socket.on('joinPrivateChat', ({ friendId }) => {
//       const room = [userId, friendId].sort().join('_'); // Create unique room ID (e.g., user1_user2)
//       socket.join(room);
//       console.log(`User ${userId} joined private chat room ${room}`);
//     });

//     // Join group room
//     socket.on('joinGroup', ({ groupId, userId }) => {
//       socket.join(groupId);
//       console.log(`User ${userId} joined group ${groupId}`);
//       // Notify group members update
//       io.to(groupId).emit('updateGroupMembers', groupId);
//     });

//     // Handle new private message
//     socket.on('sendPrivateMessage', async ({ recipientId, senderId, content, imageUrl }) => {
//       try {
//         const message = await Message.create({
//           sender: senderId,
//           recipient: recipientId, // Store recipient for private messages
//           content,
//           imageUrl,
//           timestamp: new Date(),
//         });
//         const populatedMessage = await Message.findById(message._id).populate('sender', 'username avatar');
//         const room = [senderId, recipientId].sort().join('_');
//         io.to(room).emit('newMessage', populatedMessage); // Emit to private chat room
//         console.log(`New private message sent to room ${room}:`, populatedMessage);
//       } catch (error) {
//         console.error('Error sending private message:', error);
//       }
//     });

//     // Handle new group message
//     socket.on('sendGroupMessage', async ({ groupId, sender, content, imageUrl }) => {
//       try {
//         const message = await Message.create({
//           sender,
//           groupId,
//           content,
//           imageUrl,
//           timestamp: new Date(),
//         });
//         const populatedMessage = await Message.findById(message._id).populate('sender', 'username avatar');
//         io.to(groupId).emit('newGroupMessage', populatedMessage);
//       } catch (error) {
//         console.error('Error sending group message:', error);
//       }
//     });

//     // Handle message deletion (for private messages)
//     socket.on('deletePrivateMessage', async ({ messageId, senderId, recipientId }) => {
//       try {
//         const message = await Message.findById(messageId);
//         if (!message) {
//           console.error('Message not found:', messageId);
//           return;
//         }
//         // Verify senderId matches the message sender for security
//         if (String(message.sender) !== String(senderId)) {
//           console.error('Unauthorized attempt to delete message:', messageId);
//           return;
//         }
//         await Message.findByIdAndDelete(messageId);
//         const room = [senderId, recipientId].sort().join('_');
//         io.to(room).emit('messageDeleted', messageId);
//         console.log(`Message ${messageId} deleted in room ${room}`);
//       } catch (error) {
//         console.error('Error deleting private message:', error);
//       }
//     });

//     // Handle group member updates
//     socket.on('requestGroupMembers', async (groupId) => {
//       try {
//         const group = await Group.findById(groupId).populate('members', 'username avatar');
//         if (group) {
//           io.to(groupId).emit('groupMembersUpdated', group.members);
//         }
//       } catch (error) {
//         console.error('Error fetching group members:', error);
//       }
//     });

//     socket.on('disconnect', () => {
//       console.log('Người dùng đã ngắt kết nối:', socket.id);
//     });
//   });
// };
import Message from '../models/messageModel.js';
import Group from '../models/groupModel.js';

export const initSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('Người dùng đã kết nối:', socket.id);

    const userId = socket.handshake.query.userId;
    if (!userId) {
      console.error('No userId provided for socket:', socket.id);
      return;
    }

    socket.on('joinPrivateChat', ({ friendId }) => {
      const room = [userId, friendId].sort().join('_');
      socket.join(room);
      console.log(`User ${userId} joined private chat room ${room}`);
    });

    socket.on('joinGroup', ({ groupId, userId }) => {
      socket.join(groupId);
      console.log(`User ${userId} joined group ${groupId}`);
      io.to(groupId).emit('updateGroupMembers', groupId);
    });

    socket.on('sendPrivateMessage', async ({ recipientId, senderId, content, imageUrl }) => {
      try {
        const message = await Message.create({
          sender: senderId,
          recipient: recipientId,
          content,
          imageUrl,
          timestamp: new Date(),
        });
        const populatedMessage = await Message.findById(message._id).populate('sender', 'username avatar');
        const room = [senderId, recipientId].sort().join('_');
        io.to(room).emit('newMessage', populatedMessage);
        console.log(`New private message sent to room ${room}:`, populatedMessage);
      } catch (error) {
        console.error('Error sending private message:', error);
      }
    });

    socket.on('sendGroupMessage', async ({ groupId, sender, content, imageUrl }) => {
      try {
        const message = await Message.create({
          sender,
          groupId,
          content,
          imageUrl,
          timestamp: new Date(),
        });
        const populatedMessage = await Message.findById(message._id).populate('sender', 'username avatar');
        io.to(groupId).emit('newGroupMessage', populatedMessage);
      } catch (error) {
        console.error('Error sending group message:', error);
      }
    });

    socket.on('deletePrivateMessage', async ({ messageId, senderId, recipientId }) => {
      try {
        const message = await Message.findById(messageId);
        if (!message) {
          console.error('Message not found:', messageId);
          return;
        }
        if (String(message.sender) !== String(senderId)) {
          console.error('Unauthorized attempt to delete message:', messageId);
          return;
        }
        await Message.findByIdAndDelete(messageId);
        const room = [senderId, recipientId].sort().join('_');
        io.to(room).emit('messageDeleted', messageId);
        console.log(`Message ${messageId} deleted in room ${room}`);
      } catch (error) {
        console.error('Error deleting private message:', error);
      }
    });

    socket.on('deleteGroupMessage', async ({ messageId, senderId, groupId }) => {
      try {
        const message = await Message.findById(messageId);
        if (!message) {
          console.error('Message not found:', messageId);
          return;
        }
        if (String(message.sender) !== String(senderId)) {
          console.error('Unauthorized attempt to delete message:', messageId);
          return;
        }
        await Message.findByIdAndDelete(messageId);
        io.to(groupId).emit('messageDeleted', messageId);
        console.log(`Message ${messageId} deleted in group ${groupId}`);
      } catch (error) {
        console.error('Error deleting group message:', error);
      }
    });

    socket.on('requestGroupMembers', async (groupId) => {
      try {
        const group = await Group.findById(groupId).populate('members', 'username avatar');
        if (group) {
          io.to(groupId).emit('groupMembersUpdated', group.members);
        }
      } catch (error) {
        console.error('Error fetching group members:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('Người dùng đã ngắt kết nối:', socket.id);
    });
  });
};