const express = require('express');
const { getAllMessages, addMessage } = require('../controllers/messageControllers');
const messageRouter = express.Router();

messageRouter.get('/:chatID' ,getAllMessages);
messageRouter.post('/' , addMessage);

module.exports = messageRouter;