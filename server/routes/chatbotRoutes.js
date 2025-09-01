const express = require('express');
const router = express.Router();
const chat = require('../controllers/chatbotController')
const authMiddleware = require("../middlewares/auth-middleware");

router.route('/chat').post(authMiddleware, chat.chatWithBot);

module.exports = router;
