import mongoose from 'mongoose'

const readReceiptSchema = new mongoose.Schema(
  {
    messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    readAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
)

const ReadReceipt = mongoose.models.ReadReceipt || mongoose.model('ReadReceipt', readReceiptSchema)
export default ReadReceipt
