const { body, validationResult } = require('express-validator');
const { ErrorResponse } = require('./errorHandler');

// Middleware to handle validation results
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));

    return res.status(400).json({
        success: false,
        errors: extractedErrors,
    });
};

// Auth Validations
const registerValidation = [
    body('name').notEmpty().withMessage('Name is required').trim(),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    validate,
];

const loginValidation = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
];

// Quiz Validations
const quizValidation = [
    body('title').notEmpty().withMessage('Title is required').trim().isLength({ max: 100 }),
    body('description').optional().isLength({ max: 500 }),
    body('timeLimit').optional().isInt({ min: 1 }).withMessage('Time limit must be a positive integer'),
    body('questions').isArray({ min: 1 }).withMessage('At least one question is required'),
    body('questions.*.questionText').notEmpty().withMessage('Each question must have text'),
    body('questions.*.correctAnswer').notEmpty().withMessage('Each question must have a correct answer'),
    body('questions.*.options').isArray({ min: 2 }).withMessage('Each question must have at least 2 options'),
    validate,
];

// Question Validations
const questionValidation = [
    body('questionText').notEmpty().withMessage('Question text is required'),
    body('type')
        .isIn(['multiple-choice', 'true-false', 'short-answer'])
        .withMessage('Invalid question type'),
    body('options')
        .if(body('type').equals('multiple-choice'))
        .isArray({ min: 2 })
        .withMessage('Multiple choice questions must have at least 2 options'),
    body('correctAnswer').notEmpty().withMessage('Correct answer is required'),
    body('points').optional().isInt({ min: 1 }),
    validate,
];

module.exports = {
    registerValidation,
    loginValidation,
    quizValidation,
    questionValidation,
};
