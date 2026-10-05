const Course = require('../models/Course.js');
const LiveClass = require('../models/LiveClass.js');
const Notification = require('../models/Notification.js');

// @desc    Search courses by title or category
// @route   GET /api/search?q=query
// @access  Public
const searchCourses = async (req, res) => {
  try {
    const query = req.query.q || '';
    const courses = await Course.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get upcoming live classes
// @route   GET /api/live-classes
// @access  Private
const getLiveClasses = async (req, res) => {
  try {
    const liveClasses = await LiveClass.find().populate('course', 'title');
    res.status(200).json({
      success: true,
      data: liveClasses
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort('-createdAt');
    res.status(200).json({
      success: true,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  searchCourses,
  getLiveClasses,
  getNotifications
};
