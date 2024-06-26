
const Chat = require('./../models/chatModal');
const mongoose = require('mongoose');
const Message = require('./../models/messageModal');
const getAllChats =async(req,res) =>{
   
    const userId =req.user._id;

    try{
            const chats =await Chat.find({members : {$elemMatch : {$eq:userId}}})
            .populate('members' ,'-password')
            .populate('admin' , "-password")
            .sort({updatedAt  :-1}).lean();
          
         for(let chat of chats) {
            if (chat.newMessage) {
              const message = await Message.findById(chat.newMessage).populate('sentBy', 'name').lean();
             
              chat.newMessage = message; // Replace ID with populated message object
            }
          }  

         
            res.status(200).json(chats);
     
    }
    catch(err){
    
        res.status(404).json({
            message:"Not found"
        })
    }
}

const getChat =async(req,res)=>{
    const id = req.body.userId;

    try{
     
        if(!id){
            throw new Error("invalid user");
        }
        const chat  =await Chat.find({isGroup : false,  
        $and : [
            {members : {$elemMatch : {$eq :req.user._id}}},
            {members : {$elemMatch :{$eq: id}}}
        ]  
        }).populate('members' ,"-password")
        .populate('newMessage')
        .populate({
            path:"newMessage",
            populate : {
                path:"sentBy",
                select : 'name email profilepic'
            }
        })
        if(chat.length>0){
            res.status(200).json(chat[0]);
            return;
        }
     
        let ch = {
            chatName : "sender",
            isGroup:false,
            members : [id,req.user._id],
            
        }
       let mchat = await (await Chat.create(ch)).populate("members" ,"-password");
      
        res.status(200).json(mchat);
      }
    catch(err){
    
         res.status(400).json(err);
    }
}

const createGroup = async (req ,res) =>{
  const {name , members} = req.body;
  if(!name||!members||members?.length<2){
    res.status(404).json({message:'bad request'});
    return;
  }
  try{
     const group = {
        chatName : name,
        isGroup : true,
        members :[...members , req.user._id],
        admin : req.user._id,
     }
     const mygroup = await (await (await Chat.create(group)).populate("members" ,"-password")).populate("admin" ,"-password");
     res.status(201).json(mygroup);
  }
  catch(err){
    res.status(500).json(err);
  }
}
const renameGroup =async(req,res) =>{
   
    const {groupId ,chatName} = req.body;
    try{
        const newname = await Chat.findByIdAndUpdate(groupId , {chatName} , {new: true}).populate("admin" , "-password")
        .populate("members" ,"-password");
        if(!newname){
             throw new Error('Group Not found');
        }
        res.status(200).json(newname);
    }
    catch(err){
        res.status(400).json(err);
    }

}

const addToGroup =async (req,res) =>{
     const {groupId , memberIds}  = req.body;
 
     try{
        const updatedgroup =await Chat.findByIdAndUpdate(groupId , {
          $addToSet : {members : { $each : memberIds}}
        },{new:true}).populate("admin" , "-password").populate("members" ,"-password");

        if(!updatedgroup){
            throw new Error('Group Not found');
       }
        res.status(200).json(updatedgroup);
     }
     catch(err){
        res.status(404).json({message:err.message});
     }
}
const removeFromGroup =async(req,res) =>{
     const {groupId , memberIds} = req.body;
  if(!memberIds){
    res.status(401).json({message:"bad request"});
    return;
  }
  try{
    const updatedgroup =await Chat.findByIdAndUpdate(
        groupId,
        { $pull: { members: { $in: memberIds } } }, // Use $pull with $in to remove specified members
        { new: true })
       .populate("admin" , "-password")
       .populate("members" ,"-password");
    
    if(!updatedgroup){
        throw new Error('Group Not found');
   }
    res.status(200).json(updatedgroup);
 }
 catch(err){
    res.status(404).json({message:err.message});
 }


}
module.exports ={getAllChats,getChat ,createGroup,renameGroup,addToGroup,removeFromGroup}