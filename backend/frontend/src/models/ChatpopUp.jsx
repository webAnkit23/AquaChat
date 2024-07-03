import React ,{useState} from 'react'
import admin from './../utils/protection.png'
import { MdPersonAddAlt1 } from "react-icons/md";
import GroupInfoModal from './GroupInfoModal.jsx';
import EditGroupModal from './EditGroupModal.jsx';
export default function ChatpopUp({setShowPopUp,selectedChat}) {
  const [showGroupModal , setShowGroupModal] = useState(-1);
  return (
    <div className='absolute z-[10000] w-[max-content] bg-white border-2 rounded shadow-sm  right-4'>

        <div onClick={() =>setShowGroupModal(0)} className='flex items-center p-2 text-center border-b-2 cursor-pointer hover:bg-gray-200 text-nowrap'>
            <img className='h-[30px] w-[30px]  rounded-full' src={admin}/>
            <h1 className=''>Group Info</h1>
        </div>
        <div onClick={()=>setShowGroupModal(1)} className='flex items-center gap-2 p-2 text-center border-b-2 cursor-pointer hover:bg-gray-200 text-nowrap'>
            <MdPersonAddAlt1 size={30} color='rgb(205 5 255)'/>
            <h1 className=''>Edit Group </h1>
        </div>
       
   {showGroupModal==0 && <GroupInfoModal setShowGroupModal={setShowPopUp} selectedChat ={selectedChat}/>}
   {showGroupModal==1 && <EditGroupModal setShowGroupModal={setShowPopUp} selectedChat ={selectedChat}/>}
     
    </div>
  )
}
