const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/auth');

// Use both protect and isAdmin middleware
router.get('/users', protect, isAdmin, adminController.getAllUsers);

module.exports = router;