import mongoose from 'mongoose'

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  answers: [{
    text: { type: String, required: true }
  }],
  correctAnswerIndex: { type: Number, required: true },
  explanation: { type: String, required: true }
},
{ timestamps: true }
)
const Question = mongoose.models.Question || mongoose.model('Question', questionSchema)
export default Question