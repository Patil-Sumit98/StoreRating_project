const express = require('express');
const router = express.Router();
const db = require('../db');
const { protect, authorize } = require('../middleware/authMiddleware');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get(
  '/profile',
  protect, // CORRECT: Pass the function reference, DO NOT call it with ()
  (req, res) => {
    // Because the 'protect' middleware ran successfully,
    // it added the user object to the request. We can now access it.
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      address: req.user.address,
    });
  }
);

// @desc    Get admin-only content
// @route   GET /api/users/admin-stuff
// @access  Private/Admin
router.get(
  '/admin-stuff',
  protect, // CORRECT
  authorize('ADMIN'), // CORRECT
  (req, res) => {
    res.json({
      success: true,
      message: 'You have accessed admin-only content!',
    });
  }
);

module.exports = router;

