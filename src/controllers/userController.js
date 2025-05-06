import User from '../models/userModel'

// Gửi yêu cầu kết bạn
export const sendFriendRequest = async (req, res) => {
  try {
    const { userId } = req.body // ID của người được gửi yêu cầu
    const currentUserId = req.user.id // ID của người gửi yêu cầu

    // Kiểm tra nếu người dùng được gửi yêu cầu tồn tại
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' })
    }

    // Kiểm tra nếu hai người đã là bạn bè
    if (user.friends.includes(currentUserId)) {
      return res.status(400).json({ message: 'Hai người đã là bạn bè' })
    }

    // Thêm bạn bè vào danh sách của cả hai người
    user.friends.push(currentUserId)
    await user.save()

    const currentUser = await User.findById(currentUserId)
    currentUser.friends.push(userId)
    await currentUser.save()

    res.status(200).json({ message: 'Kết bạn thành công' })
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error })
  }
}