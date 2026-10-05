const express = require('express');
const {
  getQuizByCourse,
  submitQuiz,
  createQuiz,
  seedQuizzes
} = require('../controllers/quizController.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.post('/seed', protect, seedQuizzes);
router.post('/', protect, createQuiz);
router.get('/:courseId', protect, getQuizByCourse);
router.post('/:quizId/submit', protect, submitQuiz);

module.exports = router;
