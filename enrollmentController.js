const Enrollment = require('../models/Enrollment.js');
const Course = require('../models/Course.js');

// @desc    Enroll in a course
// @route   POST /api/courses/:courseId/enroll
// @access  Private
const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    // 1. Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // 2. Check existing enrollment
    const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId });
    if (existingEnrollment) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
    }

    // 3. Create Enrollment
    const enrollment = await Enrollment.create({ user: userId, course: courseId });

    res.status(201).json({
      success: true,
      message: 'Enrolled successfully',
      data: enrollment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get enrolled courses for logged in user
// @route   GET /api/enrollments/my-courses
// @access  Private
const getMyCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id }).populate({
      path: 'course',
      populate: { path: 'instructor', select: 'name email' }
    });

    res.status(200).json({
      success: true,
      data: enrollments.map(e => e.course)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  enrollCourse,
  getMyCourses
};
