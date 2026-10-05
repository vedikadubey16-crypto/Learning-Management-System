const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Please provide quiz title']
    },
    questions: [
      {
        questionText: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctAnswerIndex: { type: Number, required: true } // 0, 1, 2, or 3
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Quiz', quizSchema);
