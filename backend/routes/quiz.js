const express = require('express');
const router = express.Router();
const {
    createQuiz,
    getAllQuizzes,
    getUserQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz,
    addQuestionToQuiz,
    updateQuestion,
    deleteQuestion,
    submitQuiz,
    getLeaderboard,
    getGlobalLeaderboard,
    getQuizByCode
} = require('../controllers/quizController');
const { protect } = require('../utils/authMiddleware');
const { quizValidation, questionValidation } = require('../utils/validators');

// Public routes
router.get('/', getAllQuizzes);
router.get('/user/me', protect, getUserQuizzes);
router.get('/leaderboard/global', getGlobalLeaderboard);
router.get('/:id', getQuizById);
router.get('/:id/leaderboard', getLeaderboard);
router.get('/code/:code', getQuizByCode);

// Protected Quiz routes
router.post('/', protect, quizValidation, createQuiz);
router.put('/:id', protect, quizValidation, updateQuiz);
router.delete('/:id', protect, deleteQuiz);

// Protected Question routes
router.post('/:id/questions', protect, questionValidation, addQuestionToQuiz);
router.put('/questions/:questionId', protect, questionValidation, updateQuestion);
router.delete('/questions/:questionId', protect, deleteQuestion);
router.post('/:id/submit', protect, submitQuiz);

module.exports = router;
