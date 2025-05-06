import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'sender is required'] },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'recipient is required'] },
  content: { type: String, required: [true, 'content is required'] },
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: false },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: false },
  timestamp: { type: Date, default: Date.now }
})

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema)
export default Message
