import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: String,
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Danh sách bạn bè
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
  role: {
    type: String,
    enum: ['admin', 'student'],
    default: 'student',
  },
}, {
  timestamps: true,
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;