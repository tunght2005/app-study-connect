const express = require('express')
const router = express.Router()
const Schedule = require('~/models/schedule')
import User from '~/models/userModel.js'
import authenticate from '~/middlewares/auth'

router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id; // từ token
    const schedules = await Schedule.find({ userId });
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, datetime } = req.body;
    const userId = req.user.id; // ✅ Lấy từ token

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ error: 'Người dùng không tồn tại' });
    }

    const newSchedule = new Schedule({ userId, title, description, datetime });
    await newSchedule.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('new_schedule', newSchedule);
      console.log('Đã gửi thông báo tới các client', newSchedule);
    } else {
      console.warn('Không tìm thấy socket io trong req.app');
    }

    res.status(201).json(newSchedule);
  } catch (err) {
    console.error('Lỗi khi thêm lịch:', err);
    res.status(400).json({ error: err.message || 'Lỗi khi thêm lịch' });
  }
});


module.exports = router
