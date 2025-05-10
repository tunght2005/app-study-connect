import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'sender is required'] },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  content: { type: String, required: false },
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: false },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: false },
  fileUrl: { type: String, default: null },
  fileName: { type: String, default: null },
  timestamp: { type: Date, default: Date.now }
})

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema)
export default Message
