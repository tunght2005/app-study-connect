import Answer from '~/models/answerModel.js'
import Question from '~/models/questionModel.js'

export const submitAnswer = async (req, res) => {
  try {
    const { questionId, selectedAnswerIndex } = req.body
    const userId = req.user._id // từ middleware authenticate

    // Tìm câu hỏi
    const question = await Question.findById(questionId)
    if (!question) {
      return res.status(404).json({ message: 'Không tìm thấy câu hỏi.' })
    }

    // Kiểm tra đáp án đúng/sai
    const isCorrect = selectedAnswerIndex === question.correctAnswerIndex

    // Tạo câu trả lời mới
    const newAnswer = new Answer({
      question: req.body.questionId,
      author: userId,
      selectedAnswerIndex,
      isCorrect
    })

    // Lưu vào cơ sở dữ liệu
    const savedAnswer = await newAnswer.save()

    // Phản hồi kết quả
    res.status(201).json({
      message: 'Gửi câu trả lời thành công.',
      isCorrect,
      correctAnswerIndex: question.correctAnswerIndex,
      explanation: question.explanation,
      answer: savedAnswer
    })
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ: ' + error.message })
  }
}
