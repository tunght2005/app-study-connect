import mongoose from 'mongoose'

const conversationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    isGroup: { type: Boolean, required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    lastMessageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true }
  },
  { timestamps: true }
)

// eslint-disable-next-line no-unused-vars
const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema)
export default Conversation
