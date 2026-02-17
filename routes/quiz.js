const express = require('express');
const router = express.Router();
const {
    createQuiz,
    getAllQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz
} = require('../controllers/quizController');
const { protect } = require('../utils/authMiddleware');

// Public routes (can be accessed with or without auth)
router.get('/', getAllQuizzes);
router.get('/:id', getQuizById);

// Protected routes (require authentication)
router.post('/', protect, createQuiz);
router.put('/:id', protect, updateQuiz);
router.delete('/:id', protect, deleteQuiz);

module.exports = router;
