const Enrollment = require('../models/Enrollment.js');
const Progress = require('../models/Progress.js');
const QuizAttempt = require('../models/QuizAttempt.js');
const Certificate = require('../models/Certificate.js');

// @desc    Get user dashboard overview
// @route   GET /api/dashboard
// @access  Private
const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalEnrollments = await Enrollment.countDocuments({ user: userId });
    const completedCourses = await Progress.countDocuments({ user: userId, progressPercentage: 100 });
    const quizAttempts = await QuizAttempt.countDocuments({ user: userId });
    const totalCertificates = await Certificate.countDocuments({ user: userId });

    const recentProgress = await Progress.find({ user: userId })
      .populate('course', 'title thumbnail')
      .sort('-updatedAt')
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          enrolledCoursesCount: totalEnrollments,
          completedCoursesCount: completedCourses,
          quizzesAttemptedCount: quizAttempts,
          certificatesCount: totalCertificates
        },
        recentProgress
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboard };
