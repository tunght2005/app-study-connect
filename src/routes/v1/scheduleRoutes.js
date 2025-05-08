const express = require('express')
const router = express.Router()
import Schedule from '~/models/schedule.js'
import authenticateToken from '~/middlewares/auth.js'
// Lấy tất cả lịch của user đã xác thực
router.get('/get', authenticateToken, async (req, res) => {
  try {
    const schedules = await Schedule.find({ userId: req.user._id })
    res.json(schedules)
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server' })
  }
})

// Tạo mới lịch cho user đã xác thực
router.post('/post', authenticateToken, async (req, res) => {
  try {
    const { title, description, datetime } = req.body
    const userId = req.user._id

    const newSchedule = new Schedule({ userId, title, description, datetime })
    await newSchedule.save()
    // Gửi thông báo tới client qua socket.io
    const io = req.app.get('io')
    if (io) {
      io.emit('new_schedule', newSchedule)
      // eslint-disable-next-line no-console
      console.log('Đã gửi thông báo tới các client', newSchedule)
    }

    res.status(201).json(newSchedule)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

module.exports = router
