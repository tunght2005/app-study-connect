import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://tunght2005:tunglv2005nodejs@cluster0.6offlxj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    // eslint-disable-next-line no-console
    console.log('Connected to MongoDB successfully!')
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('MongoDB connection error:', error)
    process.exit(1) // stop app if can't connect
  }
}

export default connectDB
