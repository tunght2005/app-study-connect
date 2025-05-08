const jwt = require('jsonwebtoken')

const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1] // Lấy token từ header
  if (!token) {
    return res.status(401).json({ message: 'Không có token, vui lòng đăng nhập' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) // Kiểm tra token hợp lệ
    req.user = decoded // Gán thông tin người dùng vào req.user
    req.user = { id: decoded.userId }
    req.userId = decoded.userId // 👈 thêm dòng này
    next() // Chuyển sang middleware tiếp theo
  } catch (err) {
    return res.status(401).json({ message: 'Token không hợp lệ' })
  }
}

module.exports = authenticate
// import jwt from 'jsonwebtoken'
// import User from '~/models/userModel.js'

// const authenticateToken = async (req, res, next) => {
//   const authHeader = req.headers['authorization']
//   const token = authHeader && authHeader.split(' ')[1]

//   if (!token) return res.status(401).json({ error: 'Token không được cung cấp' })

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET)
//     const user = await User.findById(decoded.userId)

//     if (!user) return res.status(404).json({ error: 'Người dùng không tồn tại' })

//     req.user = user
//     next()
//   } catch (err) {
//     res.status(403).json({ error: 'Token không hợp lệ' })
//   }
// }

// export default authenticateToken