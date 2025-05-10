import FriendRequest from '../models/friendRequestModel.js'
import User from '../models/userModel.js'
import Group from '../models/groupModel.js'
// Gửi yêu cầu kết bạn
// export const sendFriendRequest = async (req, res) => {
//   try {
//     const { keyword } = req.body // Từ khóa tìm kiếm (username hoặc email)
//     const senderId = req.user.id// ID của người gửi yêu cầu (lấy từ token)

//     console.log('Sender ID:', senderId) // Kiểm tra giá trị của senderId
//     console.log('Keyword:', keyword)

//     // Kiểm tra nếu không có keyword
//     if (!keyword) {
//       return res.status(400).json({ message: 'Vui lòng cung cấp từ khóa tìm kiếm' });
//     }

//     // Tìm người nhận dựa trên keyword
//     const receiver = await User.findOne({
//       $or: [
//         { username: { $regex: keyword, $options: 'i' } }, // Tìm theo username (không phân biệt hoa thường)
//         { email: { $regex: keyword, $options: 'i' } } // Tìm theo email (không phân biệt hoa thường)
//       ]
//     });

//     if (!receiver) {
//       return res.status(404).json({ message: 'Người dùng được gửi yêu cầu không tồn tại' });
//     }

//     // Kiểm tra nếu người gửi và người nhận là cùng một người
//     if (senderId === receiver._id.toString()) {
//       return res.status(400).json({ message: 'Không thể gửi yêu cầu kết bạn cho chính mình' });
//     }

//     // Kiểm tra nếu đã tồn tại yêu cầu kết bạn giữa hai người
//     const existingRequest = await FriendRequest.findOne({
//       sender: senderId,
//       receiver: receiver._id
//     });

//     if (existingRequest) {
//       return res.status(400).json({ message: 'Yêu cầu kết bạn đã tồn tại' });
//     }

//     // Tạo yêu cầu kết bạn mới
//     const friendRequest = new FriendRequest({
//       sender: senderId,
//       receiver: receiver._id
//     });

//     await friendRequest.save();

//     res.status(201).json({ message: 'Gửi yêu cầu kết bạn thành công', friendRequest });
//   } catch (error) {
//     res.status(500).json({ message: 'Lỗi server', error: error.message });
//   }
// };
export const sendFriendRequest = async (req, res) => {
  try {
    const { keyword } = req.body // Từ khóa tìm kiếm (username hoặc email)
    const senderId = req.user.id // ID của người gửi yêu cầu (lấy từ token)

    console.log('Sender ID:', senderId) // Kiểm tra giá trị của senderId
    console.log('Keyword:', keyword)

    // Kiểm tra nếu không có keyword
    if (!keyword) {
      return res.status(400).json({ message: 'Vui lòng cung cấp từ khóa tìm kiếm' })
    }

    // Tìm người nhận dựa trên keyword
    const receiver = await User.findOne({
      $or: [
        { username: { $regex: keyword, $options: 'i' } }, // Tìm theo username (không phân biệt hoa thường)
        { email: { $regex: keyword, $options: 'i' } } // Tìm theo email (không phân biệt hoa thường)
      ]
    })

    if (!receiver) {
      return res.status(404).json({ message: 'Người dùng được gửi yêu cầu không tồn tại' })
    }

    // Kiểm tra nếu người gửi và người nhận là cùng một người
    if (senderId === receiver._id.toString()) {
      return res.status(400).json({ message: 'Không thể gửi yêu cầu kết bạn cho chính mình' })
    }

    // Kiểm tra nếu người gửi đã là bạn bè với người nhận
    const sender = await User.findById(senderId)
    if (sender.friends.includes(receiver._id.toString())) {
      return res.status(400).json({ message: 'Bạn đã là bạn bè với người này' })
    }

    // Kiểm tra nếu đã tồn tại yêu cầu kết bạn giữa hai người
    const existingRequest = await FriendRequest.findOne({
      sender: senderId,
      receiver: receiver._id,
      status: 'pending' // Chỉ kiểm tra các yêu cầu đang chờ xử lý
    })

    if (existingRequest) {
      return res.status(400).json({ message: 'Bạn đã gửi lời mời kết bạn trước đó' })
    }

    // Tạo yêu cầu kết bạn mới
    const friendRequest = new FriendRequest({
      sender: senderId,
      receiver: receiver._id
    })

    await friendRequest.save()

    res.status(201).json({ message: 'Gửi yêu cầu kết bạn thành công', friendRequest })
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message })
  }
}
export const respondToFriendRequest = async (req, res) => {
  try {
    const { requestId, status } = req.body // ID của yêu cầu và trạng thái (accepted/rejected)
    const userId = req.user.id // ID của người nhận yêu cầu (lấy từ token)

    // Kiểm tra nếu trạng thái hợp lệ
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ' })
    }

    // Tìm yêu cầu kết bạn
    const friendRequest = await FriendRequest.findById(requestId)
    if (!friendRequest) {
      return res.status(404).json({ message: 'Yêu cầu kết bạn không tồn tại' })
    }

    // Kiểm tra nếu người dùng hiện tại là người nhận yêu cầu
    if (friendRequest.receiver.toString() !== userId) {
      return res.status(403).json({ message: 'Bạn không có quyền xử lý yêu cầu này' })
    }

    // Cập nhật trạng thái yêu cầu
    friendRequest.status = status
    await friendRequest.save()

    // Nếu chấp nhận, thêm bạn bè vào danh sách của cả hai người
    if (status === 'accepted') {
      const sender = await User.findById(friendRequest.sender)
      const receiver = await User.findById(friendRequest.receiver)

      sender.friends.push(receiver._id)
      receiver.friends.push(sender._id)

      await sender.save()
      await receiver.save()
    }

    res.status(200).json({ message: `Yêu cầu kết bạn đã được ${status}`, friendRequest })
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message })
  }
}

// Lấy danh sách lời mời kết bạn
export const getFriendRequests = async (req, res) => {
  try {
    const userId = req.user.id // ID của người dùng hiện tại (lấy từ token)

    // Tìm tất cả các yêu cầu kết bạn mà người dùng hiện tại là người nhận
    const friendRequests = await FriendRequest.find({ receiver: userId, status: 'pending' })
      .populate('sender', 'username email') // Lấy thông tin người gửi
      .sort({ createdAt: -1 }) // Sắp xếp theo thời gian mới nhất

    res.status(200).json({ message: 'Lấy danh sách lời mời kết bạn thành công', friendRequests })
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message })
  }
}

// Lấy danh sách bạn bè
export const getFriends = async (req, res) => {
  try {
    const userId = req.user.id // ID của người dùng hiện tại (lấy từ token)

    // Tìm người dùng hiện tại và populate danh sách bạn bè
    const user = await User.findById(userId).populate('friends', 'username email')
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' })
    }

    res.status(200).json({ message: 'Lấy danh sách bạn bè thành công', friends: user.friends })
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message })
  }
}

// Xóa bạn bè
export const removeFriend = async (req, res) => {
  try {
    const { userId } = req.body // ID của người bạn muốn xóa (truyền vào từ client)
    const currentUserId = req.user.id // ID của người dùng hiện tại (lấy từ token)

    // Tìm người dùng hiện tại
    const currentUser = await User.findById(currentUserId)
    if (!currentUser) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' })
    }

    // Tìm người bạn muốn xóa
    const friend = await User.findById(userId)
    if (!friend) {
      return res.status(404).json({ message: 'Người bạn muốn xóa không tồn tại' })
    }

    // Đảm bảo danh sách bạn bè là mảng
    if (!Array.isArray(currentUser.friends)) {
      currentUser.friends = []
    }
    if (!Array.isArray(friend.friends)) {
      friend.friends = []
    }

    // Kiểm tra nếu hai người không phải bạn bè
    if (!currentUser.friends.includes(userId)) {
      return res.status(400).json({ message: 'Người này không có trong danh sách bạn bè' })
    }

    // Lọc bỏ các giá trị null trong danh sách bạn bè
    currentUser.friends = currentUser.friends.filter(id => id !== null)
    friend.friends = friend.friends.filter(id => id !== null)

    // Xóa bạn bè khỏi danh sách của cả hai người
    currentUser.friends = currentUser.friends.filter(id => id.toString() !== userId)
    friend.friends = friend.friends.filter(id => id.toString() !== currentUserId)

    await currentUser.save()
    await friend.save()

    res.status(200).json({ message: 'Xóa bạn bè thành công' })
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message })
  }
}