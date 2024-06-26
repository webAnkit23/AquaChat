const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');

async function authorizeMiddleware(req ,res ,next){
    const val = req?.headers?.authorization||req?.body?.headers?.authorization;
 
    if(val&&val.startsWith("Bearer")){
       
        try{
          
           const token = val.split(" ")[1];
         const value=   jwt.verify(token ,process.env.JWT_SECRET);
         const user = await User.findById(value.id , "-password");
            if(!user){
                throw new Error("you are not authorized")
           }
         req.user = user;
          next();
        }
        catch(err){
            res.status(401).json({message:err.message});
        }


    }
    else{
        res.status(401).json({message:'you are not authorized'});
    }
}
module.exports = {authorizeMiddleware}