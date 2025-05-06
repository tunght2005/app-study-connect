import express from 'express'
import connectDB from '~/configs/mongodb.js' // thêm dòng này
import authRoutes from '~/routes/v1/authRoutes.js'
import groupRoutes from './routes/v1/groupRoutes';
import dotenv from 'dotenv'
dotenv.config()


const app = express()
app.use(express.json())


const hostname = 'localhost'
const port = 5000

// Kết nối Database trước
connectDB()

app.use('/api/auth', authRoutes)
app.use('/api/groups', groupRoutes)


app.listen(port, hostname, () => {
  // eslint-disable-next-line no-console
  console.log(`http://${hostname}:${port}/`)
})
