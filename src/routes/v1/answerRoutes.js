import express from 'express'
import { submitAnswer } from '~/controllers/answerController.js'
import authenticateToken from '~/middlewares/auth.js' // Middleware xác thực người dùng

// eslint-disable-next-line no-console
const router = express.Router()

// Route gửi câu trả lời
router.post('/submit', authenticateToken, submitAnswer)

export default router
