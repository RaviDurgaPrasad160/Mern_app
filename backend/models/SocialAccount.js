const mongoose = require('mongoose');

const socialAccountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    platform: {
        type: String,
        enum: ['reddit', 'twitter'],
        required: true
    },
    username: {
        type: String,
        required: true
    },
    // Store encrypted credentials
    credentials: {
        type: Object,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastUsed: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('SocialAccount', socialAccountSchema);
