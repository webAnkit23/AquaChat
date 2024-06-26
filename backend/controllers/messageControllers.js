const Chat = require('./../models/chatModal');
const Message = require('../models/messageModal');
async function addMessage(req ,res){
    const {message , chatID} = req.body;
    let userID =req.user._id.toString();
    if(!message||!chatID||!userID){
        res.status(404).json({
            message: 'invalid data'
        });
        return;
    }
    try{
          const  newmessage= await (await Message.create({
            sentBy:userID,
            message,
            chatID
          })).populate([
            {
                path:"sentBy",
                select : "name email profilepic"
            },
            {
                path : "chatID" ,
                populate :{
                    path:"members",
                    select:"name email profilepic"
                }
            }
          ]);
         const c =  await Chat.findByIdAndUpdate(chatID , {
                    newMessage : newmessage
                },{new:true});
                
             
          res.status(200).json(newmessage);
    }
    catch(err){
        res.status(404).json({
            message: err.message
        });
    
    }
}
async function getAllMessages(req ,res){
    const {chatID} = req.params;

    if(!chatID){
        res.status(404).json({message:"Invalid Chat"});
        return;
    }
    try{
     const messages = await Message.find({chatID}).populate("sentBy" ,"-password");
     

 
     res.status(200).json(messages);
    }
    catch(err){
      
        res.status(404).json({message: err.message});
    }
}

module.exports ={addMessage ,getAllMessages};
