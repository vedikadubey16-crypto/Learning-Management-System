const express = require('express');
const { getDashboard } = require('../controllers/dashboardController.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.get('/', protect, getDashboard);

module.exports = router;
