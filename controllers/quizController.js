const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const { ErrorResponse } = require('../utils/errorHandler');

// @desc    Create a new quiz with questions
// @route   POST /api/quizzes
// @access  Private
const createQuiz = async (req, res, next) => {
    try {
        const { title, description, timeLimit, isPublic, category, difficulty, questions } = req.body;

        // Create quiz
        const quiz = await Quiz.create({
            title,
            description,
            timeLimit,
            isPublic,
            category,
            difficulty,
            creator: req.user._id
        });

        // Create questions if provided
        if (questions && questions.length > 0) {
            const questionsWithQuizId = questions.map((q, index) => ({
                ...q,
                quiz: quiz._id,
                order: index + 1
            }));

            await Question.insertMany(questionsWithQuizId);
        }

        // Populate questions before returning
        const populatedQuiz = await Quiz.findById(quiz._id)
            .populate('creator', 'name email')
            .populate('questions');

        res.status(201).json({
            success: true,
            data: populatedQuiz
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all quizzes (public or user's own)
// @route   GET /api/quizzes
// @access  Public
const getAllQuizzes = async (req, res, next) => {
    try {
        const { category, difficulty, search } = req.query;

        let query = {};

        // If user is authenticated, show public quizzes and their own
        if (req.user) {
            query = {
                $or: [
                    { isPublic: true },
                    { creator: req.user._id }
                ]
            };
        } else {
            // Show only public quizzes to unauthenticated users
            query.isPublic = true;
        }

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Filter by difficulty
        if (difficulty) {
            query.difficulty = difficulty;
        }

        // Search by title or description
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const quizzes = await Quiz.find(query)
            .populate('creator', 'name email')
            .populate('questions')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: quizzes.length,
            data: quizzes
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single quiz by ID
// @route   GET /api/quizzes/:id
// @access  Public
const getQuizById = async (req, res, next) => {
    try {
        const quiz = await Quiz.findById(req.params.id)
            .populate('creator', 'name email')
            .populate('questions');

        if (!quiz) {
            return next(new ErrorResponse('Quiz not found', 404));
        }

        // Check if user has access (public or creator)
        if (!quiz.isPublic && (!req.user || quiz.creator._id.toString() !== req.user._id.toString())) {
            return next(new ErrorResponse('Not authorized to view this quiz', 403));
        }

        res.status(200).json({
            success: true,
            data: quiz
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update quiz
// @route   PUT /api/quizzes/:id
// @access  Private (Creator only)
const updateQuiz = async (req, res, next) => {
    try {
        let quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return next(new ErrorResponse('Quiz not found', 404));
        }

        // Check if user is creator
        if (quiz.creator.toString() !== req.user._id.toString()) {
            return next(new ErrorResponse('Not authorized to update this quiz', 403));
        }

        // Update quiz
        quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate('creator', 'name email').populate('questions');

        res.status(200).json({
            success: true,
            data: quiz
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private (Creator only)
const deleteQuiz = async (req, res, next) => {
    try {
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return next(new ErrorResponse('Quiz not found', 404));
        }

        // Check if user is creator
        if (quiz.creator.toString() !== req.user._id.toString()) {
            return next(new ErrorResponse('Not authorized to delete this quiz', 403));
        }

        // Delete associated questions
        await Question.deleteMany({ quiz: quiz._id });

        // Delete quiz
        await quiz.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Quiz deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createQuiz,
    getAllQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz
};
