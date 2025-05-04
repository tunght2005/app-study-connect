import mongoose from 'mongoose'

const tokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
}
)

const Token = mongoose.model('Token', tokenSchema)
export default Token