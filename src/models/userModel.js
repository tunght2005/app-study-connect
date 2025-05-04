import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
  role: {
    type: String,
    enum: ['admin', 'student'],
    default: 'student'
  }
}, {
  timestamps: true
})

const User = mongoose.model.User || mongoose.model('User', userSchema)
export default User
