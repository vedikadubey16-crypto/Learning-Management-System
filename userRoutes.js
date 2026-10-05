const express = require('express');
const { getProfile, updateProfile } = require('../controllers/userController.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

// Protected user profile routes
router.get('/me', protect, getProfile);
router.put('/me', protect, updateProfile);

module.exports = router;
