const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');

// Route gốc cho /api/group
router.get('/', (req, res) => {
    res.status(200).json({ success: true, message: 'Group API is working!' });
});

// Tạo nhóm học
router.post('/create', groupController.createGroup);

// Lấy tất cả các nhóm học
router.get('/list', groupController.getGroups);

// Lấy danh sách nhóm học theo userId
router.get('/list/:userId', groupController.getGroupsByUserId);

// Xóa nhóm học
router.delete('/delete/:groupId', groupController.deleteGroup);

// Thêm thành viên vào nhóm
router.put('/add-member/:groupId', groupController.addMember);

// Xóa thành viên khỏi nhóm
router.put('/remove-member/:groupId', groupController.removeMember);

// Lấy thông tin chi tiết của nhóm học
router.get('/:groupId', groupController.getGroupDetails);

module.exports = router;