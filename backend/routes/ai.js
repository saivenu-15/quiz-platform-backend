const express = require('express');
const router = express.Router();
const { generateQuizQuestions } = require('../controllers/aiController');
const { protect } = require('../utils/authMiddleware');

router.post('/generate', protect, generateQuizQuestions);

module.exports = router;
