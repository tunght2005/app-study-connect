import express from 'express'
import groupController from '../../controllers/groupController'
import authenticateToken from '~/middlewares/auth'
import authorizeRoles from '~/middlewares/authorizeRole'

const router = express.Router()

// Tạo nhóm mới
router.post('/', authenticateToken, groupController.createGroup)

// Lấy danh sách tất cả các nhóm
router.get('/', authenticateToken, groupController.getAllGroups)

// Lấy thông tin chi tiết một nhóm
router.get('/:id', authenticateToken, groupController.getGroupById)

// Cập nhật thông tin nhóm
router.put('/:id', authenticateToken, authorizeRoles('admin'), groupController.updateGroup)

// Mời thành viên vào nhóm
router.post('/add-member', authenticateToken, groupController.addMemberToGroup)

// Xóa thành viên khỏi nhóm
router.post('/remove-member', authenticateToken, groupController.removeMemberFromGroup)

// Cập nhật trạng thái nhóm
router.patch('/:id/status', authenticateToken, authorizeRoles('admin'), groupController.updateGroupStatus)

// Xóa nhóm
router.delete('/:id', authenticateToken, groupController.deleteGroup)

// Tham gia nhóm hoặc chuyển hướng đến chat nếu đã là thành viên
router.post('/join/:groupId', authenticateToken, groupController.joinGroup)

export default router