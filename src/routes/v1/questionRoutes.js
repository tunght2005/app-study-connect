import express from 'express'
import { createQuestion } from '~/controllers/questionController'

const router = express.Router()

router.post('/add', createQuestion)

export default router
