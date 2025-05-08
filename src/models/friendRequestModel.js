import mongoose from 'mongoose';

const friendRequestSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Người gửi yêu cầu
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Người nhận yêu cầu
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }, // Trạng thái yêu cầu
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

const FriendRequest = mongoose.models.FriendRequest || mongoose.model('FriendRequest', friendRequestSchema);
export default FriendRequest;
