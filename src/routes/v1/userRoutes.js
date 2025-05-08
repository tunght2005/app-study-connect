import express from 'express'
import { sendFriendRequest , respondToFriendRequest, getFriendsList} from '../../controllers/userController'
import authenticateToken from '~/middlewares/auth'
import authorizeRoles from '~/middlewares/authorizeRole'
const router = express.Router()

// Ví dụ route chỉ admin mới được xem danh sách người dùng
// eslint-disable-next-line no-unused-vars
router.get('/all-users', authenticateToken, authorizeRoles('admin'), async (req, res ) => {
  // logic lấy danh sách user
})

// Route cả 2 có quyền tạo lớp học
// eslint-disable-next-line no-unused-vars
router.post('/create-class', authenticateToken, authorizeRoles('admin', 'student'), ( req, res ) => {
  // logic tạo lớp
})

// Gửi yêu cầu kết bạn
router.post('/send-friend-request', authenticateToken, sendFriendRequest);

// Chấp nhận hoặc từ chối yêu cầu kết bạn
router.post('/respond-friend-request', authenticateToken, respondToFriendRequest);

// Gửi yêu cầu kết bạn
router.post('/add-friend', authenticateToken, sendFriendRequest)

router.get('/friends-and-invites', authenticateToken, getFriendsList);
export default router