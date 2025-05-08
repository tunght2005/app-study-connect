const mongoose = require('mongoose')

const scheduleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  datetime: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Schedule', scheduleSchema)
