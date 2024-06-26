

const bcrypt = require('bcryptjs');
const User = require('./../models/userModel');



async function login(req ,res ,next){
        const {email ,password} = req.body;
        try{
           const user =await User.findOne({email});
            if(!user){
                res.status(404).json({
                 message:"User not found"
                })
                return;
            }
            const compare = await bcrypt.compare(password ,user.password);
            if(compare){
              res.status(200).json({
                 id:user._id,
                 name : user.name ,
                 email : user.email ,
                 profilepic:user.profilepic ,
                 token:await user.generateJWTtokens()
              })   
            }
            else{
              res.status(401).json({
                 message:"invalid email or password"
              })
            }
        }
        catch(err){
           next(err);
        }
}
       async function registration(req ,res,next){

        const {email ,password , name ,profilepic} = req.body;
         try{
         const user =await User.findOne({email});
         if(user){
            throw new Error('user Already exists');
         }
       const info = await User.create({email ,name ,password,profilepic});
       res.status(201).json({id:info._id ,name : info.name ,email : info.email ,profilepic:info.profilepic , token:await info.generateJWTtokens()});
     }
     catch(err){
        next(err);
    }
}
module.exports = { registration ,login};