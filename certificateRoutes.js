const express = require('express');
const {
  generateCertificate,
  getMyCertificates,
  getCertificateDetails
} = require('../controllers/certificateController.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.post('/generate', protect, generateCertificate);
router.get('/', protect, getMyCertificates);
router.get('/:id', protect, getCertificateDetails);

module.exports = router;
