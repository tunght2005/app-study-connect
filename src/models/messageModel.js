import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: function () { return !this.groupId; } },
  content: { type: String },
  imageUrl: { type: String },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: function () { return !this.recipient; } },
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
export default Message;