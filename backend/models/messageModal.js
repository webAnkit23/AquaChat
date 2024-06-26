const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
    sentBy : {type:mongoose.Schema.Types.ObjectId , ref: "User"},
    message : {type:String , trim:true , required: true},
    chatID : {type : mongoose.Schema.Types.ObjectId ,ref : "Chat"}
},{timestamps:true});
const Message = mongoose.model("message" , MessageSchema);
module.exports =Message;
