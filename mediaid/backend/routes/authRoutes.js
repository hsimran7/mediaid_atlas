const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  register, login, getMe, updateProfile, changePassword, getDashboard
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Validation rules
const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 60 }),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['seeker', 'contributor']),
];

router.post('/register', registerRules, register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.get('/dashboard', protect, getDashboard);

module.exports = router;
