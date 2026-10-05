const axios = require('axios');
const QuizAttempt = require('../models/QuizAttempt.js');
const LearningActivity = require('../models/LearningActivity.js');
const Course = require('../models/Course.js');

// Added trailing slash at the end
const ML_API_URL = 'https://learning-management-system-1ej4.onrender.com/recommend/';

const getMLRecommendations = async (userId, currentCourseTitle) => {
  try {
    let currentCourse = currentCourseTitle || 'HTML & CSS';

    const allAttempts = await QuizAttempt.find({ user: userId });
    const assessment_count = allAttempts.length;

    let mean_score = 0.0;
    if (assessment_count > 0) {
      const sumScores = allAttempts.reduce((acc, curr) => acc + curr.percentage, 0);
      mean_score = parseFloat((sumScores / assessment_count).toFixed(1));
    }

    let course_score = mean_score;
    const courseDoc = await Course.findOne({ title: currentCourse });

    if (courseDoc) {
      const courseAttempts = await QuizAttempt.find({ user: userId, course: courseDoc._id });
      if (courseAttempts.length > 0) {
        const courseSum = courseAttempts.reduce((acc, curr) => acc + curr.percentage, 0);
        course_score = parseFloat((courseSum / courseAttempts.length).toFixed(1));
      }
    }

    const total_clicks = await LearningActivity.countDocuments({
      user: userId,
      action: 'click'
    });

    const activities = await LearningActivity.find({ user: userId }).select('createdAt');
    const distinctDates = new Set(
      activities.map((a) => a.createdAt.toISOString().split('T')[0])
    );
    const active_days = distinctDates.size;

    const distinctResources = await LearningActivity.distinct('resourceId', {
      user: userId,
      resourceId: { $ne: null }
    });
    const learning_resources = distinctResources.length;

    const mlPayload = {
      current_course: String(currentCourse),
      mean_score: Number(mean_score),
      assessment_count: Number(assessment_count),
      course_score: Number(course_score),
      total_clicks: Number(total_clicks),
      active_days: Number(active_days),
      learning_resources: Number(learning_resources)
    };

    console.log('Sending Payload to Deployed ML API:', mlPayload);

    const response = await axios.post(ML_API_URL, mlPayload, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    return response.data;
  } catch (error) {
    console.error('ML Service Error:', error.response ? error.response.data : error.message);
    
    // Fallback if URL route mismatches or ML server throws 404
    return {
      recommendations: [
        { course: 'JSS', probability: 0.85 },
        { course: 'React JS', probability: 0.65 }
      ],
      note: 'Fallback static recommendations applied due to ML route variance'
    };
  }
};

module.exports = { getMLRecommendations };
