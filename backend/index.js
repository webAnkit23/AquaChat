const express = require("express");
const errorMiddileware = require('./middlewares/errorMiddlewares');
const Chat = require('./models/chatModal');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
const bodyParser = require('body-parser');
const path= require("path");
require('dotenv').config();
const {setConnectionToDb} = require('./configs/mongo');

const {Server} = require('socket.io');

const UserRouter = require('./routes/userRoutes');
const chatRouter = require('./routes/chatRoutes');
const messageRouter = require('./routes/messageRoutes');
const { authorizeMiddleware } = require("./middlewares/authorizeMiddleware");
 setConnectionToDb();

console.log(__dirname);

 app.use(bodyParser.urlencoded({ extended: false }));
 app.use('/api' , UserRouter);
 app.use('/api/chats',authorizeMiddleware,chatRouter);
 app.use('/api/message',authorizeMiddleware ,messageRouter);

 app.use(errorMiddileware);

 //    ********************************* deployement*******************************//

    if(process.env.NODE_ENV ==="production"){
        app.use(express.static(path.join(__dirname , "frontend" ,"dist")));

   app.get("*" ,(req,res)=>{
    res.sendFile(path.resolve(__dirname , "frontend" ,"dist" ,"index.html"));
   })
    }
    else{
        app.get('/',(req,res)=>{
            res.send("api is running");
        })
    }
   
//************************************************************************************* */
 
const server =app.listen(process.env.PORT , () =>{
    console.log('server started');
});
const io = new Server(server ,{
    
})


io.on('connection' ,(socket) =>{
            

             socket.on("userConnected" , (data)=>socket.join(data));

             socket.on("message" ,(message)=>{
                const members = message?.chatID?.members;
                
                if(!members)return console.log("user does not exists for this chat");
                   members.forEach((member)=>{
                    if(member._id===message.sentBy._id){
                        return;
                    }
                      socket.in(member._id).emit("new Message recieved" , message);
                      socket.in(member._id).emit("new Notification" , message);
                     
                   })
             })
             socket.on("join chat room" ,(id)=>{
                socket.join(id);
            
             });
            socket.on("leave chat room" ,(id)=>{
                socket.leave(id);
            })

             socket.on("User typing" , (id)=>{
                
                socket.in(id).emit("User typing");
             });
             socket.on("User stopped typing" ,(id)=>{
          
                socket.in(id).emit("User stopped typing");
             })
        

       socket.on("disconnect" ,()=>{
              console.log('disconnected');
    });

    
})

