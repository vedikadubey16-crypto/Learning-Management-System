const Quiz = require('../models/Quiz.js');
const QuizAttempt = require('../models/QuizAttempt.js');
const Course = require('../models/Course.js');

// @desc    Get quiz for a course (Hides correctAnswerIndex from response)
// @route   GET /api/quizzes/:courseId
// @access  Private
const getQuizByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const quiz = await Quiz.findOne({ course: courseId });
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'No quiz found for this course' });
    }

    // Hide correctAnswerIndex before sending to frontend
    const sanitizedQuestions = quiz.questions.map((q) => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options
    }));

    res.status(200).json({
      success: true,
      data: {
        _id: quiz._id,
        title: quiz.title,
        course: quiz.course,
        questions: sanitizedQuestions
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit quiz answers and evaluate score
// @route   POST /api/quizzes/:quizId/submit
// @access  Private
const submitQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body; // Expecting array: [ { questionId: "...", selectedOptionIndex: 1 }, ... ]
    const userId = req.user._id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'Answers array is required' });
    }

    // Evaluate score
    let score = 0;
    quiz.questions.forEach((question) => {
      const userAns = answers.find((a) => a.questionId.toString() === question._id.toString());
      if (userAns && Number(userAns.selectedOptionIndex) === question.correctAnswerIndex) {
        score += 1;
      }
    });

    const totalQuestions = quiz.questions.length;
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

    // Save Attempt to MongoDB
    const attempt = await QuizAttempt.create({
      user: userId,
      quiz: quiz._id,
      course: quiz.course,
      score,
      totalQuestions,
      percentage
    });

    res.status(200).json({
      success: true,
      message: 'Quiz submitted and evaluated successfully',
      data: {
        score,
        totalQuestions,
        percentage,
        attemptId: attempt._id
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a single quiz (For custom admin creation)
// @route   POST /api/quizzes
// @access  Private
const createQuiz = async (req, res) => {
  try {
    const { course, title, questions } = req.body;

    const quiz = await Quiz.create({
      course,
      title,
      questions
    });

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      data: quiz
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Seed sample quizzes for all courses
// @route   POST /api/quizzes/seed
// @access  Private
const seedQuizzes = async (req, res) => {
  try {
    await Quiz.deleteMany();

    const courses = await Course.find();
    if (courses.length === 0) {
      return res.status(400).json({ success: false, message: 'Please seed courses first!' });
    }

    const quizzesToInsert = courses.map((course) => ({
      course: course._id,
      title: `${course.title} Assessment Quiz`,
      questions: [
        {
          questionText: `What is a core concept of ${course.title}?`,
          options: ['Basics & Fundamentals', 'Cooking', 'Space travel', 'None'],
          correctAnswerIndex: 0
        },
        {
          questionText: `Which syntax or pattern is used in ${course.title}?`,
          options: ['Standard Syntax', 'Random characters', 'Plain text only', 'None'],
          correctAnswerIndex: 0
        }
      ]
    }));

    await Quiz.insertMany(quizzesToInsert);

    res.status(201).json({
      success: true,
      message: 'Quizzes seeded successfully for all courses'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getQuizByCourse,
  submitQuiz,
  createQuiz,
  seedQuizzes
};
