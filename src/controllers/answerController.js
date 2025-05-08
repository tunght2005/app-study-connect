// answerController.js
import Answer from '~/models/answerModel.js'
import Question from '~/models/questionModel.js'

export const submitAnswer = async (req, res) => {
  try {
    const { questionId, selectedAnswerIndex } = req.body // Nhận ID câu hỏi và chỉ số đáp án được chọn
    const userId = req.user._id // Lấy ID người dùng từ middleware xác thực

    // Tìm câu hỏi trong cơ sở dữ liệu
    const question = await Question.findById(questionId)
    if (!question) {
      return res.status(404).json({ message: 'Không tìm thấy câu hỏi.' })
    }

    // Kiểm tra xem đáp án người dùng chọn có đúng không
    const isCorrect = selectedAnswerIndex === question.correctAnswerIndex

    // Lưu câu trả lời vào cơ sở dữ liệu
    const newAnswer = new Answer({
      question: questionId,
      author: userId,
      selectedAnswerIndex,
      isCorrect,
      explanation: isCorrect ? question.explanation : 'Câu trả lời sai, không có giải thích.'
    })

    const savedAnswer = await newAnswer.save()
    res.status(201).json(savedAnswer) // Trả về câu trả lời đã lưu
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
