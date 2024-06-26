const express= require("express");
const UserRouter = express.Router();
const {registration , login }  = require('./../controllers/authentication');
const {searchUsers}  =require('./../controllers/usersControllers');
const { authorizeMiddleware } = require("../middlewares/authorizeMiddleware");


UserRouter.route('/').post(login).get(authorizeMiddleware,searchUsers);

UserRouter.post('/register',registration);

module.exports = UserRouter;