const express = require('express');
const router = express.Router();
const { chat, getChatHistory, getStatus } = require('../controllers/chatController');
const { protect, optionalAuth } = require('../middleware/auth');

// ── AI status check (no auth needed)
router.get('/status', getStatus);

// ── Chat endpoint (optional auth — logs if logged in)
router.post('/', optionalAuth, chat);

// ── Chat history (requires login)
router.get('/history', protect, getChatHistory);

module.exports = router;
