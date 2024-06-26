const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const userSchema = new mongoose.Schema({
     name : {
          type:String , 
          required:true
       },
     email : {
          type:String , 
          required:true ,
          unique:true
     },
     password:{
          type:String , 
          required:true
     },
     profilepic : {
          type:String , 
          default:'https://wallpapers-clan.com/wp-content/uploads/2022/09/one-piece-pfp-1.jpg'
     }
},
 {
     timestamps:true
 });

 userSchema.pre('save' ,async function(next){

     if(!this.isModified("password")){
          next();
     }
     try{
          let salt =  bcrypt.genSaltSync(10);
          let hash = bcrypt.hashSync(this.password, salt);
          this.password = hash;

     }
     catch(err){
           next(err);
     }

  });

  userSchema.methods.generateJWTtokens =  async function(){
           
     try{
          const token = jwt.sign({
               id:this._id.toString(),
               email : this.email,
               password:this.password,
               name:this.name
          },
               process.env.JWT_SECRET,
               {
                    expiresIn : "100d"
               }
          )
          return token;
     }
     catch(err){
          console.log(err);
     }
  }

const User = mongoose.model("User" , userSchema);
module.exports = User;