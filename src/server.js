import express from 'express'
// import { mapOrder } from '~/utils/sorts.js'
import connectDB from '~/configs/mongodb.js' // thêm dòng này
import authRoutes from '~/routes/v1/authRoutes.js'
import dotenv from 'dotenv'
import scheduleRoutes from '~/routes/v1/scheduleRoutes.js'
import http from 'http'
import { Server } from 'socket.io'
import { initSocket } from '~/sockets/index.js'
import friendRoutes from '~/routes/v1/friendRoutes.js'


dotenv.config()


const app = express()
app.use(express.json())
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*'
  }
})

initSocket(io)


app.set('io', io) // Đặt socket.io vào app để sử dụng trong các route khác
const hostname = 'localhost'
const port = 8017

// Kết nối Database trước
connectDB()

// app.get('/', (req, res) => {
//   // Test Absolute import mapOrder
//   // eslint-disable-next-line no-console
//   console.log(mapOrder(
//     [{ id: 'id-1', name: 'One' },
//       { id: 'id-2', name: 'Two' },
//       { id: 'id-3', name: 'Three' },
//       { id: 'id-4', name: 'Four' },
//       { id: 'id-5', name: 'Five' }],
//     ['id-5', 'id-4', 'id-2', 'id-3', 'id-1'],
//     'id'
//   ))
//   res.end('<h1>Hello World!</h1><hr>')
// })

app.use('/api/auth', authRoutes)
app.use('/api/v1/schedule', scheduleRoutes)
app.use('/api/v1/friend', friendRoutes)

server.listen(port, hostname, () => {
  // eslint-disable-next-line no-console
  console.log(`Hello Phát Tài Dev, I am running at http://${hostname}:${port}/`)
})
