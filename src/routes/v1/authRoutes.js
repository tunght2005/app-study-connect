import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '~/models/userModel.js'
import auth from '~/middlewares/auth.js'
import * as authController from '~/controllers/authController.js'

const router = express.Router()

// Đăng ký người dùng mới
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body
  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã tồn tại' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({ username, email, password: hashedPassword, role })
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

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
    res.status(200).json({ message: 'Đăng nhập thành công', token, userId: user._id })
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message })
  }
})

// Lấy profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password')
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message })
  }
})

// // Cập nhật profile
// router.put('/me', auth, async (req, res) => {
//   const { username, email } = req.body
//   try {
//     const user = await User.findById(req.userId)
//     if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' })

//     if (email !== user.email) {
//       const emailExists = await User.findOne({ email })
//       if (emailExists) return res.status(400).json({ message: 'Email đã được sử dụng' })
//     }

//     user.username = username
//     user.email = email
//     await user.save()

//     res.json({ message: 'Cập nhật thành công', user: { username, email } })
//   } catch (err) {
//     res.status(500).json({ message: 'Lỗi server', error: err.message })
//   }
// })

// Cập nhật profile
router.put('/me', auth, async (req, res) => {
  const { username, email, avatar } = req.body // ✅ Thêm avatar vào destructuring

  try {
    const user = await User.findById(req.userId)
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' })

    if (email !== user.email) {
      const emailExists = await User.findOne({ email })
      if (emailExists) return res.status(400).json({ message: 'Email đã được sử dụng' })
    }

    // ✅ Gán lại các giá trị
    user.username = username
    user.email = email
    if (avatar) user.avatar = avatar // ✅ Cập nhật avatar nếu có

    await user.save()

    res.json({
      message: 'Cập nhật thành công',
      user: {
        username: user.username,
        email: user.email,
        avatar: user.avatar // ✅ Gửi lại avatar về frontend
      }
    })
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message })
  }
})

router.get('/profile', auth, authController.profile)
router.post('/logout', authController.logout)

export default router
