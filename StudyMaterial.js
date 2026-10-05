const mongoose = require('mongoose');

const studyMaterialSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Please provide material title']
    },
    fileUrl: {
      type: String,
      required: [true, 'Please provide file URL']
    },
    fileType: {
      type: String,
      default: 'PDF'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('StudyMaterial', studyMaterialSchema);
