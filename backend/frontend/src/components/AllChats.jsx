import React, { useEffect, useState } from 'react';
import message from './../utils/message.jpg'
import Chat from './Chat';
import useGlobal from '../context/globalContext';
import { toast } from 'react-toastify';
import SideBarLoader from './SideBarLoader';
import axios from 'axios';
import { useSocket } from '../context/socketContext';
export default function AllChats() {
  const {user,chats,setChats} = useGlobal();
  const [loading ,setLoading] = useState(false);
  const {notifications} = useGlobal();
  const socket = useSocket();
   
  useEffect(() =>{
     if(socket){
      socket.on('onlineUsers', (users) => {
        console.log(users);
      });
     }
  },[socket,user]);
 
  useEffect(() =>{
     if(user===null)return;
     const fetchChats =async() =>{
      try{
        setLoading(true );
        const { data} =await axios.get('/api/chats' ,{
         headers :{
           "Content-Type" : 'application/json',
           "authorization" : `Bearer ${user.token}`
         }
        });
 
        setChats(data);
    }
     catch(err){
      console.log(err);
           toast.error(err.response.data.message);
      }
     finally{
      setLoading(false);
    }
     }
       
  fetchChats();
  },[user]);
  return (
    <div className='overflow-y-auto border-r-2'>
        <div className='flex items-center gap-2 p-3 border-b-2'>
            <img src={message} className='h-[50px] rounded-full w-[50px] object-cover'/>
            <h1 className='text-3xl font-semibold textGra2'>My Chats</h1>
        </div>
        <div className='pr-1 mt-1 '>
            {loading?<div className='flex flex-col gap-2'>
            <SideBarLoader />
            <SideBarLoader/>
            <SideBarLoader />
            <SideBarLoader />
            </div> : chats ? chats.length>0? chats.map((chat) =>{
                   return <Chat key={chat?._id } hasNotification = {notifications?.has(chat._id)} chat ={chat}/>

            }):<></> : <></> }

        </div>
    </div>
  )
}
