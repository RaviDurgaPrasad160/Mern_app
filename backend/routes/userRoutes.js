const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/auth');
const User = require('../models/User');

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get('/', protect, isAdmin, async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select('-password');
        res.json(users);
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/users/:id
// @desc    Get user by ID (admin only)
// @access  Private/Admin
router.get('/:id', protect, isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/users/:id
// @desc    Update user (admin only)
// @access  Private/Admin
router.put('/:id', protect, isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { name, email, role } = req.body;
        
        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/users/:id
// @desc    Delete user (admin only)
// @access  Private/Admin
router.delete('/:id', protect, isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.deleteOne();
        res.json({ message: 'User removed' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
