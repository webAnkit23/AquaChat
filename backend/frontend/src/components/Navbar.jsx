import React, { useState } from 'react'
import { GiWaveSurfer } from "react-icons/gi";
import InputField from './InputField';
import { FaBell } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import LogoutPopup from './../models/LogoutPopup';
import GroupModal from '../models/GroupModal';
import useGlobal from '../context/globalContext';
import ImageModal from '../models/ImageModal';
export default function Navbar({setShowSideBar}) {
  const [showGroupModal ,setShowGroupModal] = useState(false);
    const [showPopUp ,setshowPopUp] = useState(false);
    const [showModal ,setShowModal] = useState(false);
  
    const {user ,notifications} = useGlobal();
  return (
    <div className='h-[70px] select-none flex items-center md:justify-between sm:pl-8 sm:pr-8 md:gap-1 gap-3 pl-4 pr-4 border-b-2 '>
                    <InputField setShowSideBar ={setShowSideBar}/>

                    <div className='flex items-center justify-center flex-1 gap-2 text-xl font-semibold text-center text-white md:text-2xl text-nowrap text textGra2'>
                        <GiWaveSurfer size={30} className='hide' color='#5ADEFF'/>
                        <h1 className='flex self-center justify-center text-[30px] leading-[normal] sm:text-xl md:text-2xl'>AquaChat <span className='hidden sm:inline'>: Flow with Conversations</span></h1>
                        <GiWaveSurfer size={30} color='#fc00ff'/>
                    </div>

                    <div className='relative flex items-center gap-4 sm:myflex'>
                            <div className='relative'>
                          <FaBell size={27} className='flex' color='rgb(121 35 239)'/>
                          <span className='absolute top-[-5px] flex items-center justify-center text-white bg-green-500 rounded-full p-1 h-[20px] w-[20px] right-[-5px]'>{notifications?.size}</span>
                          </div>
                          <div className='relative'>
                          <HiDotsVertical className='cursor-pointer ' size={27} color='#fc00ff'onClick={() => setshowPopUp((prev) => !prev)}/>
                            {showPopUp&&<LogoutPopup setshowPopUp ={setshowPopUp} setShowGroupModal={setShowGroupModal}/>}
                          </div>
                          <div className='p-[2px]  relative hidden sm:flex rounded-full bg' onClick={()=>setShowModal(true)}><img className=' h-[60px]  animate-pulse bg border-2 w-[60px] rounded-full object-cover' src={user?.profilepic||'https://wallpapers-clan.com/wp-content/uploads/2022/09/one-piece-pfp-1.jpg'}/></div>
                    </div>
                    {showGroupModal&&<GroupModal setShowGroupModal = {setShowGroupModal}/>}
                    {showModal ?<ImageModal user={user} setOpenModal={setShowModal}/>:<></>}
    </div>
  )
}
