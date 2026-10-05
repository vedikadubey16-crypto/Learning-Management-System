const Progress = require('../models/Progress.js');
const Lecture = require('../models/Lecture.js');
const LearningActivity = require('../models/LearningActivity.js');

// @desc    Get student progress for a course
// @route   GET /api/progress/:courseId
// @access  Private
const getProgress = async (req, res) => {
  try {


    const { courseId } = req.params;
    const userId = req.user._id;

    let progress = await Progress.findOne({ user: userId, course: courseId });

    if (!progress) {
      progress = await Progress.create({
        user: userId,
        course: courseId,
        completedLectures: [],
        progressPercentage: 0
      });
    }

    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update progress when a lecture is completed
// @route   PATCH /api/progress/:courseId
// @access  Private
const updateProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { lectureId } = req.body;
    const userId = req.user._id;

    if (!lectureId) {
      return res.status(400).json({ success: false, message: 'lectureId is required' });
    }

    // 1. Fetch total lectures for the course
    const totalLectures = await Lecture.countDocuments({ course: courseId });

    // 2. Find or create user progress document
    let progress = await Progress.findOne({ user: userId, course: courseId });
    if (!progress) {
      progress = new Progress({ user: userId, course: courseId, completedLectures: [] });
    }

    // 3. Add lecture to completed set if not already completed
    if (!progress.completedLectures.includes(lectureId)) {
      progress.completedLectures.push(lectureId);
    }

    // 4. Calculate percentage safely
    const count = progress.completedLectures.length;
    progress.progressPercentage = totalLectures > 0 ? Math.round((count / totalLectures) * 100) : 100;

    await progress.save();

    // 5. Log activity for ML tracking (click / lecture_view)
    await LearningActivity.create({
      user: userId,
      course: courseId,
      action: 'lecture_view',
      resourceId: lectureId
    });

    res.status(200).json({
      success: true,
      message: 'Progress updated successfully',
      data: progress
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Log generic user click/activity (For ML data points)
// @route   POST /api/progress/:courseId/activity
// @access  Private
const logActivity = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { action, resourceId } = req.body;
    const userId = req.user._id;

    const activity = await LearningActivity.create({
      user: userId,
      course: courseId,
      action: action || 'click',
      resourceId: resourceId || null
    });

    res.status(201).json({
      success: true,
      message: 'Activity logged',
      data: activity
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProgress,
  updateProgress,
  logActivity
};
