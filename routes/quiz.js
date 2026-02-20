const express = require('express');
const router = express.Router();
const {
    createQuiz,
    getAllQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz,
    addQuestionToQuiz,
    updateQuestion,
    deleteQuestion
} = require('../controllers/quizController');
const { protect } = require('../utils/authMiddleware');
const { quizValidation, questionValidation } = require('../utils/validators');

// Public routes
router.get('/', getAllQuizzes);
router.get('/:id', getQuizById);

// Protected Quiz routes
router.post('/', protect, quizValidation, createQuiz);
router.put('/:id', protect, quizValidation, updateQuiz);
router.delete('/:id', protect, deleteQuiz);

// Protected Question routes
router.post('/:id/questions', protect, questionValidation, addQuestionToQuiz);
router.put('/questions/:questionId', protect, questionValidation, updateQuestion);
router.delete('/questions/:questionId', protect, deleteQuestion);

module.exports = router;
