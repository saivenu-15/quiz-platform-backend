const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a quiz title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    timeLimit: {
        type: Number, // in minutes
        default: 30,
        min: [1, 'Time limit must be at least 1 minute'],
        max: [180, 'Time limit cannot exceed 180 minutes']
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    category: {
        type: String,
        enum: ['general', 'science', 'history', 'mathematics', 'technology', 'sports', 'entertainment', 'other'],
        default: 'general'
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Index for faster queries
QuizSchema.index({ creator: 1 });
QuizSchema.index({ isPublic: 1, createdAt: -1 });

// Virtual populate for questions
QuizSchema.virtual('questions', {
    ref: 'Question',
    localField: '_id',
    foreignField: 'quiz',
    justOne: false
});

// Cascade delete questions when a quiz is deleted
QuizSchema.pre('remove', async function (next) {
    await this.model('Question').deleteMany({ quiz: this._id });
    next();
});

module.exports = mongoose.model('Quiz', QuizSchema);
