import connectDB from '~/configs/mongodb.js'
import Token from '~/models/tokenModel.js'
import User from '~/models/userModel.js'

const run = async () => {
  await connectDB()

  // Tìm user bằng email hoặc _id
  const user = await User.findOne({ email: 'example@example.com' }) // Hoặc tìm theo _id nếu cần

  if (!user) {
    // eslint-disable-next-line no-console
    console.log('User không tồn tại')
    process.exit()
  }
  // Tạo token JWT
  // eslint-disable-next-line no-unused-vars, no-undef
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })

  await Token.create({
    token: Token,
    userId: user._id, // Sử dụng _id của user tìm được
    expiresAt: new Date(Date.now() + 3600 * 1000) // hết hạn sau 1 tiếng
  })

  // eslint-disable-next-line no-console
  console.log('Tạo token thành công')
  process.exit()
}

run()
