import express from 'express'
import { createQuestion } from '~/controllers/questionController'
import authenticateToken from '~/middlewares/auth.js'
import Question from '~/models/questionModel.js'
import { submitAnswer } from '~/controllers/answerController.js'
const router = express.Router()

router.post('/add', authenticateToken, createQuestion)
router.get('/get', authenticateToken, async (req, res) => {
  try {
    const questions = await Question.find()
    res.json(questions)
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server' })
  }
})

router.post('/submit', authenticateToken, submitAnswer)

export default router
