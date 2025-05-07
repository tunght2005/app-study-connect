import mongoose from 'mongoose'

const friendSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
)

const Friend = mongoose.models.Friend || mongoose.model('Friend', friendSchema)
export default Friend
