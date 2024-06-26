const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    chatName : {type :String , trim :true  ,required: true},
    isGroup : {type:Boolean , default : false},
    members : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }
    ] ,
    newMessage :  {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Message"
    },
    admin : {
         type : mongoose.Schema.Types.ObjectId,
            ref : "User"
    }
},{timestamps :true});

const Chat = mongoose.model("Chat" , chatSchema);
module.exports = Chat;