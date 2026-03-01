const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const { ErrorResponse } = require('../utils/errorHandler');

// @desc    Create a new quiz with questions
// @route   POST /api/quizzes
// @access  Private
const createQuiz = async (req, res, next) => {
    try {
        const { title, description, timeLimit, isPublic, category, difficulty, questions } = req.body;
        console.log(`📝 Creating quiz: "${title}" by user ${req.user._id}`);

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
        console.log(`✅ Quiz created: ${quiz._id}`);

        // Create questions if provided
        if (questions && questions.length > 0) {
            const questionsWithQuizId = questions.map((q, index) => ({
                ...q,
                quiz: quiz._id,
                order: index + 1
            }));

            await Question.insertMany(questionsWithQuizId);
        }

        // Populate creator and virtual questions before returning
        const populatedQuiz = await Quiz.findById(quiz._id)
            .populate('creator', 'name email');

        // Note: 'questions' is a virtual field. In Mongoose 8/7, it might need explicit population if not handled.
        // We'll manually attach them or ensure the virtual works by fetching again after insertMany.
        const finalQuiz = await Quiz.findById(quiz._id)
            .populate('creator', 'name email')
            .populate('questions');

        res.status(201).json({
            success: true,
            data: finalQuiz
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

// @desc    Get logged in user's quizzes
// @route   GET /api/quizzes/user/me
// @access  Private
const getUserQuizzes = async (req, res, next) => {
    try {
        const quizzes = await Quiz.find({ creator: req.user._id })
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

// @desc    Get quiz by Join Code
// @route   GET /api/quizzes/code/:code
// @access  Public
const getQuizByCode = async (req, res, next) => {
    try {
        const quiz = await Quiz.findOne({ joinCode: req.params.code })
            .populate('creator', 'name email')
            .populate('questions');

        if (!quiz) {
            return next(new ErrorResponse('Quiz not found with this code', 404));
        }

        // Check if user has access (public or creator)
        if (!quiz.isPublic && (!req.user || (quiz.creator && quiz.creator._id.toString() !== req.user._id.toString()))) {
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

// @desc    Add question to quiz
// @route   POST /api/quizzes/:id/questions
// @access  Private (Creator only)
const addQuestionToQuiz = async (req, res, next) => {
    try {
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return next(new ErrorResponse('Quiz not found', 404));
        }

        // Check if user is creator
        if (quiz.creator.toString() !== req.user._id.toString()) {
            return next(new ErrorResponse('Not authorized to add questions to this quiz', 403));
        }

        // Get the current question count for order
        const questionCount = await Question.countDocuments({ quiz: quiz._id });

        const question = await Question.create({
            ...req.body,
            quiz: quiz._id,
            order: questionCount + 1
        });

        res.status(201).json({
            success: true,
            data: question
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update a question
// @route   PUT /api/quizzes/questions/:questionId
// @access  Private (Creator only)
const updateQuestion = async (req, res, next) => {
    try {
        let question = await Question.findById(req.params.questionId).populate('quiz');

        if (!question) {
            return next(new ErrorResponse('Question not found', 404));
        }

        // Check if user is creator of the quiz
        if (question.quiz.creator.toString() !== req.user._id.toString()) {
            return next(new ErrorResponse('Not authorized to update this question', 403));
        }

        question = await Question.findByIdAndUpdate(req.params.questionId, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: question
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a question
// @route   DELETE /api/quizzes/questions/:questionId
// @access  Private (Creator only)
const deleteQuestion = async (req, res, next) => {
    try {
        const question = await Question.findById(req.params.questionId).populate('quiz');

        if (!question) {
            return next(new ErrorResponse('Question not found', 404));
        }

        // Check if user is creator of the quiz
        if (question.quiz.creator.toString() !== req.user._id.toString()) {
            return next(new ErrorResponse('Not authorized to delete this question', 403));
        }

        await question.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Question deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Submit quiz results
// @route   POST /api/quizzes/:id/submit
// @access  Private
const submitQuiz = async (req, res, next) => {
    try {
        const { score, totalQuestions, answers } = req.body;
        const quizId = req.params.id;

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return next(new ErrorResponse('Quiz not found', 404));
        }

        const Participant = require('../models/Participant');

        const participant = await Participant.create({
            quiz: quizId,
            user: req.user._id,
            score: score,
            totalPoints: totalQuestions, // In this simple version, 1 point per question
            percentage: Math.round((score / totalQuestions) * 100),
            status: 'completed',
            completedAt: Date.now(),
            answers: answers || []
        });

        res.status(201).json({
            success: true,
            data: participant
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get leaderboard for a quiz
// @route   GET /api/quizzes/:id/leaderboard
// @access  Public
const getLeaderboard = async (req, res, next) => {
    try {
        const Participant = require('../models/Participant');
        const leaderboard = await Participant.find({ quiz: req.params.id })
            .populate('user', 'name')
            .sort({ score: -1, completedAt: 1 })
            .limit(10);

        res.status(200).json({
            success: true,
            data: leaderboard
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get global leaderboard
// @route   GET /api/quizzes/leaderboard/global
// @access  Public
const getGlobalLeaderboard = async (req, res, next) => {
    try {
        const Participant = require('../models/Participant');
        // Simple global leaderboard: sum of all scores per user
        const globalLeaderboard = await Participant.aggregate([
            { $match: { status: 'completed' } },
            {
                $group: {
                    _id: '$user',
                    totalScore: { $sum: '$score' },
                    quizzesPlayed: { $sum: 1 }
                }
            },
            { $sort: { totalScore: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userInfo'
                }
            },
            { $unwind: '$userInfo' },
            {
                $project: {
                    _id: 1,
                    totalScore: 1,
                    quizzesPlayed: 1,
                    name: '$userInfo.name'
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: globalLeaderboard
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
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
};
