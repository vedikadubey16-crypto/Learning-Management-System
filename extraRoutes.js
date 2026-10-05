const express = require('express');
const {
  searchCourses,
  getLiveClasses,
  getNotifications
} = require('../controllers/extraController.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.get('/search', searchCourses);
router.get('/live-classes', protect, getLiveClasses);
router.get('/notifications', protect, getNotifications);

module.exports = router;
