import express from 'express'
import groupRoutes from './routes/v1/groupRoutes'
import connectDB from '~/configs/mongodb.js'
import authRoutes from '~/routes/v1/authRoutes.js'
import userRoutes from '~/routes/v1/userRoutes.js'
import scheduleRoutes from '~/routes/v1/scheduleRoutes.js'
import http from 'http'
import { Server } from 'socket.io'
import { initSocket } from '~/sockets/socket.js'
import chatRoutes from '~/routes/v1/chatRoutes.js'
import dotenv from 'dotenv'
import testRoutes from '~/routes/v1/testRoutes.js'
import q_aRoutes from '~/routes/v1/q_aRoutes.js'

dotenv.config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*' // Adjust for production
  }
})

app.set('io', io) // Make io accessible in controllers
initSocket(io) // Initialize Socket.IO events

const hostname = '0.0.0.0'
const port = process.env.PORT || 8017

// Connect to MongoDB
connectDB()

app.use('/api/auth', authRoutes)
app.use('/api/v1/chat', chatRoutes)
app.use('/api/v1/qa', q_aRoutes)
app.use('/api', testRoutes)
app.use('/api/groups', groupRoutes)
app.use('/api/users', userRoutes)
app.use('/uploads', express.static('uploads'))
app.use('/api/v1/schedule', scheduleRoutes)

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})