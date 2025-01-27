const mongoose = require('mongoose');

const automationTaskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    socialAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SocialAccount',
        required: true
    },
    taskType: {
        type: String,
        enum: ['post', 'comment', 'like', 'share', 'dm'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'running', 'completed', 'failed'],
        default: 'pending'
    },
    schedule: {
        type: Date,
        required: true
    },
    content: {
        text: String,
        media: [String], // Array of media URLs
        targetUsers: [String], // For DMs
        targetPosts: [String], // For comments/likes
        subreddits: [String], // For Reddit posts
        hashtags: [String] // For Twitter posts
    },
    executionLogs: [{
        timestamp: Date,
        action: String,
        status: String,
        message: String
    }],
    lastRun: Date,
    nextRun: Date
}, {
    timestamps: true
});

module.exports = mongoose.model('AutomationTask', automationTaskSchema);
