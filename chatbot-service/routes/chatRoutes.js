const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// POST /api/chat - Send message and get response
router.post('/chat', chatController.chat);

// GET /api/health - Health check
router.get('/health', chatController.healthCheck);

module.exports = router;
