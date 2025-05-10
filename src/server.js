import express from 'express'
import groupRoutes from './routes/v1/groupRoutes'
import connectDB from '~/configs/mongodb.js' // thêm dòng này
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
app.use(express.urlencoded({ extended: true })) // << THÊM DÒNG NÀY nếu chưa có
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*'
  }
})

initSocket(io)

io.on('connection', (socket) => {
  console.log('Người dùng đã kết nối:', socket.id);

  socket.on('chat message', (msg) => {
    console.log('Tin nhắn nhận:', msg);
    io.emit('chat message', msg); // Gửi lại cho tất cả client
  });

  socket.on('disconnect', () => {
    console.log('Người dùng đã ngắt kết nối');
  });
});

app.set('io', io) // Đặt socket.io vào app để sử dụng trong các route khác

const hostname = '0.0.0.0' // Cho phép mọi IP trong mạng LAN kết nối
const port = process.env.PORT || 8017

// Kết nối Database trước
connectDB()


app.use('/api/auth', authRoutes)
app.use('/api/v1/chat', chatRoutes)
app.use('/api/v1/qa', q_aRoutes)
app.use('/api', testRoutes)
app.use('/api/groups', groupRoutes)
app.use('/api/users', userRoutes)
app.use('/uploads', express.static('uploads'))
app.use('/api/v1/schedule', scheduleRoutes)

app.listen(port, hostname, () => {
  // eslint-disable-next-line no-console
  console.log(`Server run http://${hostname}:${port}/`)
})
