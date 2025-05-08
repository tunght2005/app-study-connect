// answerRoutes.js
import express from 'express'
import { submitAnswer } from '~/controllers/answerController.js'
import { authenticate } from '~/middlewares/auth.js' // Middleware xác thực người dùng

const router = express.Router()

// POST câu trả lời của người dùng
router.post('/', authenticate, submitAnswer)

export default router
