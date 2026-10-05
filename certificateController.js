const Certificate = require('../models/Certificate.js');
const Progress = require('../models/Progress.js');
const Course = require('../models/Course.js');

// @desc    Generate / Claim certificate for a completed course
// @route   POST /api/certificates/generate
// @access  Private
const generateCertificate = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user._id;

    // Check if progress is 100%
    const progress = await Progress.findOne({ user: userId, course: courseId });
    if (!progress || progress.progressPercentage < 100) {
      return res.status(400).json({
        success: false,
        message: 'Course progress must be 100% to generate a certificate'
      });
    }

    // Check if certificate already exists
    let certificate = await Certificate.findOne({ user: userId, course: courseId });
    if (certificate) {
      return res.status(200).json({
        success: true,
        message: 'Certificate already generated',
        data: certificate
      });
    }

    // Generate unique code
    const certificateCode = `CERT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    certificate = await Certificate.create({
      user: userId,
      course: courseId,
      certificateCode
    });

    res.status(201).json({
      success: true,
      message: 'Certificate generated successfully',
      data: certificate
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all certificates for logged in user
// @route   GET /api/certificates
// @access  Private
const getMyCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ user: req.user._id }).populate('course', 'title category');
    res.status(200).json({
      success: true,
      data: certificates
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get certificate details by ID
// @route   GET /api/certificates/:id
// @access  Private
const getCertificateDetails = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('user', 'name email')
      .populate('course', 'title description');

    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    res.status(200).json({
      success: true,
      data: certificate
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  generateCertificate,
  getMyCertificates,
  getCertificateDetails
};
