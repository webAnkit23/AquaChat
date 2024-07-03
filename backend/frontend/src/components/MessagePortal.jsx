import React, { useEffect, useMemo, useRef, useState } from 'react'

import { TfiText } from "react-icons/tfi";
import g from './../utils/groupPic.jpg';
import gallary from './../utils/gallery.png';
import smile from './../utils/smile.png';
import voice from './../utils/voice.png';
import EmojiPicker from 'emoji-picker-react';
import useGlobal from '../context/globalContext';
import arrow from './../utils/left-arrow1.png';
import { HiDotsHorizontal } from 'react-icons/hi';
import ChatpopUp from '../models/ChatpopUp';
import { FaTelegramPlane } from "react-icons/fa";
import { toast } from 'react-toastify';
import axios from 'axios';
import { useSocket } from '../context/socketContext';
import BackgroundVideo from './BackgroundVideo';
import src from './../utils/back.mp4'
export default function MessagePortal() {
const {user , selectedChat}   = useGlobal();
const {notifications, setNotifications} = useGlobal();

const socket = useSocket();
 useEffect(()=>{
  if(socket){
     socket.on("new Notification" ,data =>{  
        if(selectedChat===null){
          setNotifications(prev =>{
            let map = new Map(prev);
            map.set(data.chatID._id , data);
          
            return new Map(map);
          });
       }         
    }
   )
   return ()=>{
   
   }
  }
},[socket,selectedChat]);


  return (
     <>
      {selectedChat?<MessageWindow selectedChat ={selectedChat} setNotifications={setNotifications}   user ={user}/> :<>
      
      <BackgroundVideo src={src}/>
      </>}
     </>
  )

}

function MessageWindow({selectedChat ,setNotifications,user}){
  const socket = useSocket();
  const [input ,setInput] = useState('');
  const [istyping ,setIsTyping] = useState(false);
const [messages ,setMessages] = useState([]);
  const [loading ,setLoading] = useState(false);
  
  const selectedChatref = useRef();
  async function fetchMessages(){
    try{
          setLoading(true);
         const {data} = await axios.get(`/api/message/${selectedChat._id}`,{
            headers:{
              "content-type" : 'application/json',
              "authorization": `Bearer ${user.token}`
            }
          });
    
          setMessages(data);
    }
    catch(err){ 
       toast.error(err.response.data.message);

    }
    finally{
     setLoading(false);
     if(socket){
      socket.emit("join chat room" , selectedChat._id);
     }
    }
}
  useEffect(() =>{
    if(selectedChat==null){
      selectedChatref.current=null;
      return;
     }  
     
           fetchMessages();
            selectedChatref.current = {...selectedChat};

  },[selectedChat]);
  useEffect(()=>{
    if(socket){
    
     socket.on("new Message recieved" ,(incomingMessage)=>{
       if(!selectedChat ||selectedChat._id!== incomingMessage?.chatID?._id){
          setNotifications(prev =>{
             let map = new Map(prev);
             map.set(incomingMessage.chatID._id , incomingMessage);
            return new Map(map);
        });
       }
     else{
       setMessages(prev=>[...prev , incomingMessage]);
     }  
     });
    
     socket.on("User typing" , ()=> setIsTyping(true));
   socket.on("User stopped typing" , ()=>setIsTyping(false));
      
   return ()=>{
    socket.off("User typing");
    socket.off("User Stopped typing");
    socket.emit("leave chat room" , selectedChat._id);
   }

    } 
 },[socket]);


  const sendMessage =async() =>{
         try{
                  const { data} = await axios.post('/api/message' , {
                    headers: {
                      'Content-Type': 'application/json',
                          'authorization': `Bearer ${user.token}`
                    }, 
                     message:input,
                    chatID:selectedChat._id
                     }
        );
          setMessages((prev) =>[...prev ,data]);
          socket.emit("message" ,data);
         }
         catch(err){
          
                toast.error(err.response.data.message);
         }
         finally{
              setInput('');
              
         }
  }
  return(
    <div className='flex flex-col justify-between flex-1'>
      <div className='flex flex-col flex-1'>
                     <Header istyping={istyping} selectedChat={selectedChat}/>
                      <div className='flex flex-col bgWall gap-2 pb-1  h-[80vh] '>
                      <MessagesBox istyping={istyping} messages = {messages} loading ={loading}/>
                      
                      <InputBox setIsTyping = {setIsTyping} input ={input} setInput={setInput} sendMessage={sendMessage}/>
                  </div>
        </div>
      </div>
  )
}

function MessagesBox({messages,loading,istyping}){
  const lastref = useRef();
  const {user} = useGlobal();
  const ref = useRef(true);
  useEffect(() =>{
        lastref?.current?.scrollIntoView();
  },[messages]);
  const getTime =(date) =>{
   let s = new Date(date).toLocaleTimeString().split(":");
   return s[0] +":"+s[1]+" "+ s[2].substring(3);
  }
  const islastMessage =(email ,i) =>{
      const issender = user.email!==email;
      const islast = i===messages.length-1||messages[i].sentBy.email!==messages[i+1].sentBy.email;
      return issender&&islast;
  }

  return (
    <div className='flex flex-col-reverse  bgWall    w-[-webkit-fill-available] flex-[1] gap-2 p-2 overflow-auto '>
             <div className='h-full overflow-y-auto scrollable'>
                  <div  className='flex flex-col gap-1 p-2 overflow-y-auto'>
                 
                    {loading?<MessageLoder />:
                        <div  className='flex flex-col gap-1 p-2 overflow-y-auto'>
                       { messages.map((message,i) =>{
                          return <div key={i} className={`relative ${user.email===message.sentBy.email?"self-end":''} flex items-center gap-1 sm:gap-2`}>
                          {islastMessage(message.sentBy.email ,i) ? <img src={message?.sentBy?.profilepic||g} className={`md:h-[50px] ${user.email===message.sentBy.email?"hidden":""} md:w-[50px] w-[30px] h-[30px] rounded-full object-cover`}/>:<div className='md:w-[50px]  w-[30px]'></div>}
                          <div className={`relative ${user.email===message.sentBy.email?"self-end":''}  flex items-center gap-4 p-1 pl-2 pr-2 sm:pl-3 sm:pr-3 rounded-2xl ${user.email===message.sentBy.email?'bg':'bg2'}`}> 
                                    
                                    <div className='min-w-[50px] flex relative items-end text-white gap-3'>
                                      <p className='md:max-w-[320px] max-w-[50vw]  text-wrap break-words'>{message.message}</p>
                                      <p className={`text-[12px] ${user.email===message.sentBy.email?'text-gray-300':'text-gray-700'}  a text-nowrap`}>{getTime(message.updatedAt)}</p>
                                    </div>
                                   
                               </div>
                               
                            </div>
                            
                        })}
                        <div  ref={lastref}>
                        {istyping?<TypingUI myref ={ref} parent ={lastref}/>:<></>}
                         </div>
                        </div>
                        }           
                  </div>
                  
             </div>
    </div>
  )
}
function TypingUI({parent ,myref}){

  useEffect(()=>{
     if(myref?.current){
         myref.current = false;
         parent.current.scrollIntoView();
     }
     myref.current =false;
  },[]);
  return(
    <div className='w-[100px]  mt-1 ml-6 left-2 sm:left-3 md:left-10 relative  animate-pulse  h-[31px] flex items-center justify-center gap-[6px] bg2 rounded-full'>
         
         <span className='loader4'></span>
    </div>
  )
}

function Header({selectedChat ,istyping}){
  const {user ,setSelectedChat} = useGlobal();
  const [showPopUp ,setShowPopUp] = useState(false);
  const getSender =() =>{
    return user.id===selectedChat.members[0]._id?selectedChat.members[1]:selectedChat.members[0];
}
  return(
    <div className='shadow-lg z-10 select-none  h-[75px] flex  p-3 items-center '>
       <div className='flex items-start gap-4'>
      <div className='flex items-center h-[60px] justify-center md:hidden' onClick={() => setSelectedChat(null)}>
       <img className='h-[40px] w-[40px]' src={arrow}/>
      </div>
      <div className='flex items-center justify-center rounded-full bg'>
        <img className='h-[60px] animate-pulse rounded-full w-[60px] object-cover' src={selectedChat.isGroup?g:getSender().profilepic}/>
      </div>
      <div className='relative flex items-center'>
      <h1 className=' textGra2    font-semibold text-[30px]'>{selectedChat.isGroup?selectedChat.chatName:getSender().name}
      
      </h1>
      {istyping?<span className='absolute bottom-[-20px] text-green-500 left-1 textGra font-semibold'>typing...</span> : <></>}
      </div>
      
    </div>
   {selectedChat.isGroup&& <div className='absolute right-4'>
    <HiDotsHorizontal onClick={() => setShowPopUp(!showPopUp)}   size={30} color='#fc00ff'/>
      <div className='relative'>
           {showPopUp&&<ChatpopUp setShowPopUp ={setShowPopUp}  selectedChat ={selectedChat}/>}
      </div>
    </div>}
    </div>
  )
}
function InputBox({input,setInput,sendMessage}){
  const inputref= useRef();
 const timerRef = useRef();
 const socket = useSocket();
 const {selectedChat} = useGlobal();
 const [showEmoji ,setShowEmoji] = useState(false);
 const [typing ,setTyping] = useState(false);
  const handleKeyDown =(e) =>{
        if(timerRef.current){
          clearTimeout(timerRef.current);
        }
        
  if(e.code=='Enter'){
    clearTimeout(timerRef.current);
    socket.emit("User stopped typing" , selectedChat._id);
    setTyping(false);
    sendMessage();
    return;
  }
        
         setTyping(true);
        timerRef.current=  setTimeout(()=>{
                 setTyping(false);
         },2000);

  }
  useEffect(()=>{
   inputref.current.focus();
  },[]);

  useEffect(()=>{
    if(socket){

      if(typing){
        socket.emit("User typing" , selectedChat._id);
      }
      else{
        socket.emit("User stopped typing" , selectedChat._id);
      }
      
    }   

  },[typing]);
  const handleEmoji=(e)=>{
    setInput(prev => prev+e.emoji);
  }
return (
  <div className='  z-1 flex items-center w-[-webkit-fill-available] gap-2 pr-5 select-none '>
  <div className='wave flex items-center rounded-full p-2 m-1  w-[inherit]  border-2 h-[50px]'>
         <div className='items-center justify-center hidden rounded-full cursor-pointer sm:flex bg'>  <img className='h-[34px] rounded-full animate-pulse w-[34px]' src={voice}/></div>
             <div className='flex-grow '>
              <input ref={inputref} type='text font-roboto' onKeyDown={(e) =>handleKeyDown(e)} value={input} onChange={(e) => setInput(e.target.value)} placeholder='Flow your message here...' className='w-full pl-3 text-lg bg-transparent focus:outline-none' />
              </div>
              <div className='flex items-center gap-2'>
              <div className='flex items-center justify-center p-1 rounded-full cursor-pointer hover:bg-gray-200 '>  <img className='md:h-[30px] h-6  md:w-[30px]' src={smile} onClick={()=> setShowEmoji(prev=>!prev)}/></div>
                  <div className='items-center justify-center hidden p-1 rounded-full cursor-pointer sm:flex hover:bg-gray-200'><TfiText size={20}/></div>
                 
                  <div className='flex items-center justify-center p-1 rounded-full cursor-pointer hover:bg-gray-200'>  <img className='md:h-[30px] h-6 md:w-[30px]' src={gallary}/></div>
              </div>
              {showEmoji? <div className='absolute bottom-[60px] left-2 z-[10000]'>
                <div className='h-[100vh] fixed w-[100vw] gray top-0 z-[100] opacity-[.3]' onClick={()=> setShowEmoji(false)}></div>
                <div className='absolute bottom-[0px] left-2 z-[10000]'>
                <EmojiPicker onEmojiClick={handleEmoji} width={300} autoFocusSearch={true} allowExpandReactions={true} height={400}/>
                </div>
                </div>:<></>}
             </div>
             <div className='relative flex items-center justify-center'>
             <div className=' flex items-center justify-center p-1 cursor-pointer bg h-[40px] rounded-xl '> 
              <FaTelegramPlane className='text-white' onClick={sendMessage} size={30}/>
               </div>
             </div>
   </div>
)
}

function MessageLoder(){


  return (
    <div className='flex flex-col w-full gap-3'>
          
          <div className='flex flex-col gap-1'>
            <span className='h-[30px] ml-10 w-[150px] bg2 animate-pulse rounded-full'></span>
            <div className='flex items-center gap-1 '>
              <span className='rounded-full h-[40px] w-[40px] bg2 animate-pulse'></span>
              <span className='h-[30px] w-[100px] bg2 animate-pulse rounded-full'></span>
            </div>
          </div>
          <div className='flex flex-col self-end gap-1'>
            <span className='h-[30px] self-end w-[100px] bg animate-pulse rounded-full'></span>
            <div className='flex items-center gap-1 '>
             
              <span className='h-[30px] w-[150px] bg animate-pulse rounded-full'></span>
            </div>
          </div>
          <div className='flex flex-col gap-1'>
            <span className='h-[30px] ml-10 w-[150px] bg2 animate-pulse rounded-full'></span>
            <div className='flex items-center gap-1 '>
              <span className='rounded-full h-[40px] w-[40px] bg2 animate-pulse'></span>
              <span className='h-[30px] w-[100px] bg2 animate-pulse rounded-full'></span>
            </div>
          </div>
          <div className='flex flex-col self-end gap-1'>
            <span className='h-[30px] w-[100px] self-end bg animate-pulse rounded-full'></span>
            <div className='flex items-center gap-1 '>
             
              <span className='h-[30px] w-[140px] bg animate-pulse rounded-full'></span>
            </div>
          </div>
          <div className='flex flex-col gap-1'>
            <span className='h-[30px] ml-10 w-[150px] bg2 animate-pulse rounded-full'></span>
            <div className='flex items-center gap-1 '>
              <span className='rounded-full h-[40px] w-[40px] bg2 animate-pulse'></span>
              <span className='h-[30px] w-[100px] bg2 animate-pulse rounded-full'></span>
            </div>
          </div>

    </div>
  )
}