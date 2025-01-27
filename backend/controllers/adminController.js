const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    // Check if the requesting user is an admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const users = await User.find({}, {
      password: 0,
      __v: 0
    });

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};