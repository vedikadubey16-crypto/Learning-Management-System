const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Please provide lecture title']
    },
    videoUrl: {
      type: String,
      required: [true, 'Please provide video URL']
    },
    duration: {
      type: Number, // in minutes
      default: 10
    },
    order: {
      type: Number,
      default: 1
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Lecture', lectureSchema);
