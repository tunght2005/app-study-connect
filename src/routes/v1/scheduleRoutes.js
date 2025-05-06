const express = require('express')
const router = express.Router()
const Schedule = require('~/models/schedule')
import User from '~/models/userModel.js'
router.get('/:userId', async (req, res) => {
  try {
    const schedules = await Schedule.find({ userId: req.params.userId })
    res.json(schedules)
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { userId, title, description, datetime } = req.body

    // Kiểm tra userId có tồn tại không
    const existingUser = await User.findById(userId)
    if (!existingUser) {
      return res.status(404).json({ error: 'Người dùng không tồn tại' })
    }

    const newSchedule = new Schedule({ userId, title, description, datetime })
    await newSchedule.save()
    // eslint-disable-next-line no-console
    console.log(req.body)

    // Gửi thông báo socket
    const io = req.app.get('io')
    if (io) {
      io.emit('new_schedule', newSchedule)
      // eslint-disable-next-line no-console
      console.log('Đã gửi thông báo tới các client', newSchedule) // gửi đến tất cả client
    } else {
      // eslint-disable-next-line no-console
      console.warn('không tìm thấy socket io trong req.app ')
    }
    res.status(201).json(newSchedule)
  } catch (err) {
    res.status(400).json({ erorr: err.message })
  }
})

module.exports = router
