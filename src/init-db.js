import connectDB from '~/configs/mongodb.js'
import User from '~/models/userModel.js'
import Token from '~/models/tokenModel.js'
import RefreshToken from '~/models/refreshTokenModel.js'
import Conversation from '~/models/conversationModel.js'
import Message from '~/models/messageModel.js'
import ReadReceipt from '~/models/readReceiptModel.js'
import FriendRequest from '~/models/friendRequestModel.js'
import Friend from '~/models/friendModel.js'
import Group from '~/models/groupModel.js'

const run = async () => {
  await connectDB()

  // Tạo user gửi
  const senderUser = await User.create({
    username: 'jondoe123',
    email: 'user6@example.com',
    password: '123456',
    name: 'John Doe',
    avatarUrl: 'https://example.com/avatar.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  })

  // Tạo user nhận
  const recipientUser = await User.create({
    username: 'janedoe456',
    email: 'user7@example.com',
    password: '654321',
    name: 'Jane Doe',
    avatarUrl: 'https://example.com/avatar2.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  })

  // eslint-disable-next-line no-console
  console.log('Sender tạo thành công:', senderUser)
  // eslint-disable-next-line no-console
  console.log('Recipient tạo thành công:', recipientUser)

  // Tạo token mẫu
  await Token.create({
    token: 'abcdef123456',
    userId: senderUser._id,
    expiresAt: new Date(Date.now() + 3600 * 1000)
  })

  await RefreshToken.create({
    token: 'refresh-token-abcdef',
    userId: senderUser._id,
    expiresAt: new Date(Date.now() + 86400 * 1000)
  })

  const conversation = await Conversation.create({
    name: 'Chat between John and Jane',
    isGroup: false,
    participants: [senderUser._id, recipientUser._id],
    userId: senderUser._id,
    token: 'sample-token',
    createdAt: new Date(),
    updatedAt: new Date(),
    expiresAt: new Date(Date.now() + 3600 * 1000)
  })

  const message = await Message.create({
    content: 'Hello, Jane!',
    sender: senderUser._id,
    recipient: recipientUser._id,
    conversationId: conversation._id,
    groupId: null,
    createdAt: new Date(),
    updatedAt: new Date()
  })

  // eslint-disable-next-line no-console
  console.log('Message tạo thành công:', message)

  await ReadReceipt.create({
    userId: recipientUser._id,
    messageId: message._id,
    readAt: new Date()
  })

  // Sửa lỗi: dùng senderUser thay vì user
  await FriendRequest.create({
    sender: senderUser._id, // Đã sửa từ user._id thành senderUser._id
    receiver: recipientUser._id, // Đã sửa từ user._id thành recipientUser._id
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  })

  await Friend.create({
    user1: senderUser._id,
    user2: recipientUser._id,
    createdAt: new Date()
  })

  await Group.create({
    name: 'Study Group',
    description: 'A group for studying',
    avatarUrl: 'https://example.com/group-avatar.jpg',
    adminId: senderUser._id,
    createdBy: senderUser._id, // Người tạo nhóm
    members: [
      senderUser._id, // Người tạo nhóm
      recipientUser._id // Thành viên còn lại
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  })

  // eslint-disable-next-line no-console
  console.log('Tạo dữ liệu mẫu hoàn tất!')
  process.exit()
}

run()
