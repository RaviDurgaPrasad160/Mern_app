const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = {
    protect: async (req, res, next) => {
        try {
            // Get token from header
            const token = req.header('Authorization')?.replace('Bearer ', '');
            
            if (!token) {
                return res.status(401).json({ message: 'No token, authorization denied' });
            }

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Get user from database
            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                return res.status(401).json({ message: 'Token is not valid' });
            }

            req.user = user;
            next();
        } catch (error) {
            console.error('Auth middleware error:', error);
            res.status(401).json({ message: 'Not authorized to access this route' });
        }
    },

    isAdmin: async (req, res, next) => {
        try {
            if (req.user && req.user.role === 'admin') {
                next();
            } else {
                res.status(403).json({ message: 'Access denied. Admin only route.' });
            }
        } catch (error) {
            console.error('Admin middleware error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
};
