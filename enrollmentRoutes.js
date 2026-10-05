const express = require('express');
const { getMyCourses } = require('../controllers/enrollmentController.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.get('/my-courses', protect, getMyCourses);

module.exports = router;
