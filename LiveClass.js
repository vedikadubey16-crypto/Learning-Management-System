const mongoose = require('mongoose');

const liveClassSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    meetingUrl: {
      type: String,
      required: true
    },
    scheduledAt: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('LiveClass', liveClassSchema);
