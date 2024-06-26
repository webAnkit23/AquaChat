import React ,{useCallback, useMemo, useState} from 'react';
import useGlobal from '../context/globalContext';
import g from './../utils/groupPic.jpg';
import ImageModal from '../models/ImageModal';
export default function Chat({chat,hasNotification}) {
  const { user,setSelectedChat,selectedChat,notifications ,setNotifications} = useGlobal();
const [openModal , setOpenModal ] = useState(false);
console.log(hasNotification,notifications);
 const getSender =useCallback(() =>{
       return user.id==chat.members[0]._id?chat.members[1]:chat.members[0];
 },[chat ,user]) ;
 const getTime =(date) =>{
  let s = new Date(date).toLocaleTimeString().split(":");
  return s[0] +":"+s[1]+" "+ s[2].substring(3);
 }
 const handleClick =()=>{
    const map = new Map(notifications);
    map.delete(chat._id);
    setNotifications(map);
  setSelectedChat(chat);
 }

  return (
    <div onClick={handleClick} className={ `${selectedChat?._id===chat._id?'bg':''} ${hasNotification?"bg2" : ""} relative flex items-center gap-3 p-2 duration-150 border-b-2 cursor-pointer hoverEffect`}>
        <div>
            <img className='h-[50px]  rounded-full w-[50px] object-cover' onClick={(e) =>{
              e.stopPropagation();
              setOpenModal(true)
            }} src={chat.isGroup?g:getSender().profilepic}/>
        </div>
        <div className='flex flex-col items-start '>
            <h1 className='text-lg '>{chat.isGroup?chat.chatName:getSender()?.name}</h1>
            <p className={`overflow-hidden font-semibold ${selectedChat?._id===chat._id?'text-white ':''} text-nowrap`}>
              <span className='text-green-800'>
              {chat?.newMessage&&chat?.newMessage?.sentBy._id==user.id?'You : ' :`${chat?.newMessage?.sentBy.name} : `}
              </span>
              <span>

                {hasNotification ?notifications.get(chat._id).sentBy.name +" " + notifications.get(chat._id).message.substring(0,25) :"" }
               {chat?.newMessage?.message?.length>30?chat.newMessage?.message?.substring(0,27)+"..." :chat?.newMessage?.message}
               </span>
              </p>
        </div>
        <div className={`absolute  ${selectedChat?._id===chat._id?'text-white ':'text-gray-500'} right-1 text-sm top-3`}>{getTime(chat.updatedAt) }</div>
    {openModal ? <ImageModal user = {chat.isGroup?g:getSender()} setOpenModal={setOpenModal} /> :''}
    </div>
  )
}
