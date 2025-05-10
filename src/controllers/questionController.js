import Question from '~/models/questionModel.js'

export const createQuestion = async (req, res) => {
  try {
    const {
      // eslint-disable-next-line no-unused-vars
      title, description, answers, correctAnswerIndex, explanation
    } = req.body

    // Kiểm tra dữ liệu đầu vào
    // eslint-disable-next-line no-console
    console.log('Request body:', req.body)

    // if (!answers || answers.length !== 4) {
    //   // eslint-disable-next-line no-console
    //   console.log('Invalid answers:', answers) // In ra giá trị của answers
    //   return res.status(400).json({ message: 'Phải có đúng 4 đáp án.' })
    // }

    // Kiểm tra giá trị của req.user.id (nếu có)
    // eslint-disable-next-line no-console
    console.log('User ID:', req.user ? req.user._id : 'No user info')
    // eslint-disable-next-line no-unused-vars
    // Tạo câu hỏi mới
    const newQuestion = new Question({
      title,
      description,
      author: req.userId, // nếu dùng middleware xác thực
      answers,
      correctAnswerIndex,
      explanation
    })

    // Kiểm tra dữ liệu của câu hỏi mới trước khi lưu
    // eslint-disable-next-line no-console
    console.log('New Question:', newQuestion)

    // Lưu câu hỏi vào cơ sở dữ liệu
    const savedQuestion = await newQuestion.save()

    // Kiểm tra câu hỏi đã lưu
    // eslint-disable-next-line no-console
    console.log('Saved Question:', savedQuestion)

    res.status(201).json(savedQuestion)
  } catch (error) {
    // In lỗi ra console để dễ dàng debug
    // eslint-disable-next-line no-console
    console.log('Error occurred:', error.message)
    res.status(500).json({ message: error.message })
  }
}
