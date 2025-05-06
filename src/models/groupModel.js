import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Người tạo nhóm
    createdAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['online', 'offline'],
      default: 'offline',
    },
  },
  { timestamps: true }
);

const Group = mongoose.models.Group || mongoose.model('Group', groupSchema);
export default Group;