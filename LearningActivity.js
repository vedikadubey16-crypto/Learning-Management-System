const mongoose = require('mongoose');

const learningActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    action: {
      type: String,
      enum: ['click', 'resource_view', 'lecture_view'],
      default: 'click'
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('LearningActivity', learningActivitySchema);
