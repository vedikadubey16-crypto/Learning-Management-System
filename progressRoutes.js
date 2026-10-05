const express = require('express');
const {
  getProgress,
  updateProgress,
  logActivity
} = require('../controllers/progressController.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.get('/:courseId', protect, getProgress);
router.patch('/:courseId', protect, updateProgress);
router.post('/:courseId/activity', protect, logActivity);

module.exports = router;
