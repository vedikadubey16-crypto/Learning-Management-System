const express = require('express');
const {
  getCourses,
  getCourseDetails,
  getCourseLectures,
  getCourseMaterials,
  seedCourses
} = require('../controllers/courseController.js');
const { enrollCourse } = require('../controllers/enrollmentController.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.get('/', getCourses);
router.post('/seed', protect, seedCourses);
router.get('/:courseId', getCourseDetails);
router.post('/:courseId/enroll', protect, enrollCourse);
router.get('/:courseId/lectures', protect, getCourseLectures);
router.get('/:courseId/materials', protect, getCourseMaterials);

module.exports = router;
