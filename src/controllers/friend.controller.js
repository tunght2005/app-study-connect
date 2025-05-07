// import FriendRequest from '~/models/friendRequestModel.js'
// import Friend from '~/models/friendModel.js'

// export const sendFriendRequest = async (req, res) => {
//   const { receiverId } = req.params
//   const senderId = req.user._id

//   try {
//     const exists = await FriendRequest.findOne({ senderId, receiverId })
//     if (exists) return res.status(400).json({ message: 'Đã gửi lời mời trước đó' })

//     const newRequest = await FriendRequest.create({ senderId, receiverId })
//     res.status(201).json(newRequest)
//   } catch (err) {
//     res.status(500).json({ message: 'Lỗi khi gửi lời mời', error: err.message })
//   }
// }

// export const respondToRequest = async (req, res) => {
//   const { requestId } = req.params
//   const { status } = req.body // accepted hoặc rejected

//   try {
//     const request = await FriendRequest.findById(requestId)
//     if (!request) return res.status(404).json({ message: 'Không tìm thấy lời mời' })

//     request.status = status
//     await request.save()

//     if (status === 'accepted') {
//       const alreadyFriend = await Friend.findOne({
//         $or: [
//           { user1: request.senderId, user2: request.receiverId },
//           { user1: request.receiverId, user2: request.senderId }
//         ]
//       })

//       if (!alreadyFriend) {
//         await Friend.create({
//           user1: request.senderId,
//           user2: request.receiverId
//         })
//       }
//     }

//     res.status(200).json({ message: `Lời mời đã được ${status}` })
//   } catch (err) {
//     res.status(500).json({ message: 'Lỗi xử lý lời mời', error: err.message })
//   }
// }
