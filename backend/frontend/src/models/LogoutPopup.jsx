import React, { useState } from 'react'
import { BiLogOutCircle } from "react-icons/bi";
import useGlobal from '../context/globalContext';
import { useNavigate } from 'react-router-dom';
import group from './../utils/group.png'
import { FaRegUserCircle } from "react-icons/fa";
import ImageModal from './ImageModal';
export default function LogoutPopup({setshowPopUp,setShowGroupModal}) {
  const navigate = useNavigate();
  const {user,setUser,setSelectedChat ,setNotifications, setChats} = useGlobal();
  const [openModal ,setOpenModal] = useState(false);
  const handleLogOut =() =>{
  localStorage.removeItem("AquaUser");
  setUser(null);
  setChats(null);
  setSelectedChat(null);
  navigate('/');
  setNotifications(new Map());
  }
  const handlegroup =() =>{
    setShowGroupModal(true);
    setshowPopUp(false);
  }
  return (
    <div  className='absolute left-[-120px] w-[130px]  cursor-pointer  z-40 bg-white shadow-md'>

      <div className='flex items-center justify-center gap-3 pt-2 pb-2 font-semibold border-b-2 hoverEffect'>
              <FaRegUserCircle size={20} color='#fc00ff'/>
                <span onClick={ ()=>setOpenModal(true)}>User</span>
            </div>
           <div className='flex items-center justify-center gap-2 pt-2 pb-2 font-semibold border-b-2 hoverEffect'>
            <BiLogOutCircle size={20} color='#fc00ff'/>
            <span onClick={handleLogOut}>Log Out</span>
           </div>

           <div className='flex items-center justify-center gap-2 pt-2 pb-2 font-semibold hoverEffect'  onClick={handlegroup}>
            <img className='h-[35px] w-[35px] rounded-full ' src={group}/>
             <span>Group+</span>
           </div>

           {openModal ? <ImageModal setOpenModal={setOpenModal} user={user}/> :<></>}
         
    </div>
  )
}
