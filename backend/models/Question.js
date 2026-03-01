const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    questionText: {
        type: String,
        required: [true, 'Please add a question'],
        trim: true,
        maxlength: [500, 'Question cannot be more than 500 characters']
    },
    type: {
        type: String,
        enum: ['multiple-choice', 'true-false', 'short-answer'],
        required: [true, 'Please specify question type']
    },
    options: [{
        type: String,
        trim: true
    }],
    correctAnswer: {
        type: String,
        required: [true, 'Please provide the correct answer']
    },
    points: {
        type: Number,
        default: 10,
        min: [1, 'Points must be at least 1'],
        max: [100, 'Points cannot exceed 100']
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for faster queries
QuestionSchema.index({ quiz: 1, order: 1 });

// Validation: multiple-choice must have at least 2 options
QuestionSchema.pre('save', function (next) {
    if (this.type === 'multiple-choice' && (!this.options || this.options.length < 2)) {
        next(new Error('Multiple choice questions must have at least 2 options'));
    }

    if (this.type === 'true-false') {
        this.options = ['True', 'False'];
    }

    next();
});

module.exports = mongoose.model('Question', QuestionSchema);
