const { getMLRecommendations } = require('../services/mlService.js');

// @desc    Get course recommendations from ML API
// @route   POST /recommend
// @access  Private
const getRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    const { current_course } = req.body; // Optional current course title from request body

    const recommendationsData = await getMLRecommendations(userId, current_course);

    res.status(200).json({
      success: true,
      message: 'Recommendations fetched successfully',
      data: recommendationsData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { getRecommendations };
