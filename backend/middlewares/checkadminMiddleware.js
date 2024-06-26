const Chat = require('./../models/chatModal');
async function checkadminMiddleware(req ,res , next){
    const {groupId} = req.body;

    
    try{
         const group = await (await Chat.findById(groupId)).populate("admin" ,"-password");
         if((group.admin._id).toString()!=req.user._id.toString()){
          console.log('notadmin');
           res.status(401).json({message:"You are not an admin"});
           return;
         }
         next();

    }
    catch(err){
       res.status(200).json({message:"sonething has crashed"});
    }
}
module.exports = checkadminMiddleware;