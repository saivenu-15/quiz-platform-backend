const mongoose = require('mongoose');

const ParticipantSchema = new mongoose.Schema({
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    answers: [{
        question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question'
        },
        userAnswer: String,
        isCorrect: Boolean,
        pointsEarned: {
            type: Number,
            default: 0
        }
    }],
    score: {
        type: Number,
        default: 0
    },
    totalPoints: {
        type: Number,
        default: 0
    },
    percentage: {
        type: Number,
        default: 0
    },
    startedAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    },
    timeTaken: {
        type: Number // in seconds
    },
    status: {
        type: String,
        enum: ['in-progress', 'completed', 'abandoned'],
        default: 'in-progress'
    }
}, {
    timestamps: true
});

// Compound index for unique user-quiz combinations and faster queries
ParticipantSchema.index({ quiz: 1, user: 1 });
ParticipantSchema.index({ user: 1, completedAt: -1 });

// Calculate score before saving
ParticipantSchema.pre('save', function (next) {
    if (this.answers && this.answers.length > 0) {
        this.score = this.answers.reduce((total, answer) => {
            return total + (answer.pointsEarned || 0);
        }, 0);

        if (this.totalPoints > 0) {
            this.percentage = Math.round((this.score / this.totalPoints) * 100);
        }
    }

    if (this.status === 'completed' && this.startedAt && this.completedAt) {
        this.timeTaken = Math.floor((this.completedAt - this.startedAt) / 1000);
    }

    next();
});

module.exports = mongoose.model('Participant', ParticipantSchema);
