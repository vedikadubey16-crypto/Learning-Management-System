const express = require('express');
const { getRecommendations } = require('../controllers/recommendationController.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

// Required contract endpoint: POST /recommend
router.post('/recommend', protect, getRecommendations);

module.exports = router;
