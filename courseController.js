const Course = require('../models/Course.js');
const Lecture = require('../models/Lecture.js');
const StudyMaterial = require('../models/StudyMaterial.js');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor', 'name email');
    res.status(200).json({
      success: true,
      data: courses
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get course details by ID
// @route   GET /api/courses/:courseId
// @access  Public
const getCourseDetails = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).populate('instructor', 'name email');
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get lectures for a course
// @route   GET /api/courses/:courseId/lectures
// @access  Private
const getCourseLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find({ course: req.params.courseId }).sort('order');
    res.status(200).json({
      success: true,
      data: lectures
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get study materials for a course
// @route   GET /api/courses/:courseId/materials
// @access  Private
const getCourseMaterials = async (req, res) => {
  try {
    const materials = await StudyMaterial.find({ course: req.params.courseId });
    res.status(200).json({
      success: true,
      data: materials
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Seed initial dummy courses (For Development Ease)
// @route   POST /api/courses/seed
// @access  Public
const seedCourses = async (req, res) => {
  try {
    await Course.deleteMany();
    
    const requiredCourses = [
      { title: 'HTML & CSS', description: 'Learn web development basics.', category: 'Web Development' },
      { title: 'JSS', description: 'JavaScript Fundamentals and modern features.', category: 'Web Development' },
      { title: 'React JS', description: 'Build dynamic frontend applications.', category: 'Web Development' },
      { title: 'Node.js & Express', description: 'Backend APIs with Node and Express.', category: 'Backend' },
      { title: 'SQL & Database', description: 'Relational database basics and SQL queries.', category: 'Database' },
      { title: 'Python Programming', description: 'Python core programming.', category: 'Programming' },
      { title: 'ML', description: 'Machine Learning algorithms and model deployment.', category: 'Data Science' }
    ];

    const seeded = await Course.insertMany(
      requiredCourses.map(c => ({ ...c, instructor: req.user ? req.user._id : null }))
    );

    res.status(201).json({
      success: true,
      message: 'Courses seeded successfully',
      data: seeded
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCourses,
  getCourseDetails,
  getCourseLectures,
  getCourseMaterials,
  seedCourses
};
