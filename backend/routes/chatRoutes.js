const express = require('express');
const chatRouter = express.Router();
const {getAllChats, getChat, createGroup,renameGroup, addToGroup,removeFromGroup} = require('./../controllers/chatControllers');
const checkadminMiddleware = require('../middlewares/checkadminMiddleware');

chatRouter.route('/')
.get(getAllChats)
.post(getChat);

chatRouter.post('/group' , createGroup);
chatRouter.put('/group/rename' ,checkadminMiddleware , renameGroup);
chatRouter.put('/group/add' ,checkadminMiddleware , addToGroup);
chatRouter.put('/group/remove' ,checkadminMiddleware , removeFromGroup);

module.exports = chatRouter;