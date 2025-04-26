import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../../models/userModel.js' // nhớ thêm .js

const router = express.Router()

// Đăng ký người dùng mới
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã tồn tại' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({ username, email, password: hashedPassword })
    await newUser.save()

    res.status(201).json({ message: 'Đăng ký thành công' })
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message })
  }
})

// Đăng nhập người dùng
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Người dùng không tồn tại' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu sai' })
    }

    const token = jwt.sign({ userId: user._id }, 'secret_key', { expiresIn: '1h' })
    res.status(200).json({ message: 'Đăng nhập thành công', token })
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message })
  }
})

export default router
