const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('~/models/userModel')

const JWT_SECRET = process.env.JWT_SECRET || 'secret123'

// Đăng ký người dùng
exports.register = async (req, res) => {
  const { username, email, password, role } = req.body

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã tồn tại' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({ username, email, password: hashedPassword, role: role || 'student' })
    await newUser.save()

    res.status(201).json({ message: 'Đăng ký thành công' })
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message })
  }
}

// Đăng nhập người dùng
exports.login = async (req, res) => {
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

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' })
    res.status(200).json({ message: 'Đăng nhập thành công', token })
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message })
  }
}

// Lấy thông tin người dùng
exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password') // bỏ mật khẩu
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' })
    }

    res.status(200).json(user)
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message })
  }
}

// Đăng xuất (chỉ xử lý phía client)
exports.logout = (req, res) => {
  res.status(200).json({ message: 'Đã đăng xuất. Vui lòng xoá token ở phía client.' })
}
