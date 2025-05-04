const jwt = require('jsonwebtoken')

const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1] // Lấy token từ header
  if (!token) {
    return res.status(401).json({ message: 'Không có token, vui lòng đăng nhập' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) // Kiểm tra token hợp lệ
    req.user = decoded // Gán thông tin người dùng vào req.user
    next() // Chuyển sang middleware tiếp theo
  } catch (err) {
    return res.status(401).json({ message: 'Token không hợp lệ' })
  }
}

module.exports = authenticate
