import * as ReactDOM from 'react-dom';
import React from 'react'
import i from './../utils/groupPic.jpg';
import { GiCrossMark } from 'react-icons/gi';
export default function ImageModal({user,setOpenModal }) {
    
    const handleClose =(e)=>{
        e.stopPropagation();
        setOpenModal(false);
    }
  return (
    ReactDOM.createPortal(
    <>
    
    <div className='h-[100vh] fixed w-[100vw] gray top-0 z-[100] opacity-[.5]' onClick={handleClose}></div>
    <div className='absolute overflow-y-auto  shadow-lg  top-[50%] left-[50%] translate-x-[-50%] z-[1000] opacity-[1] bg-white translate-y-[-50%] md:h-auto   border-2 '>
          
          <div className='bg2 border-1'>
                     <div className='w-[300px] relative h-[300px]'>
                    <img className='object-cover w-full h-full ' src={user?.profilepic||i}/>
                    <GiCrossMark onClick={handleClose} size={30} className='hover:scale-[1.2] text-[#fc00ff] duration-100  absolute right-2 top-3 md:top-2'/>
                    </div>
                    <div className=''>
                    <h1 className='flex items-center p-1 text-xl text-center border-b-2 hover:text-white hoverEffect p- '>
                            <span className='w-full text-left '>Name : {user.name}</span>
     
                        </h1>
                        <h1 className='flex items-center p-1 text-xl text-center border-b-2 hover:text-white hoverEffect '>
                            <span className=''>Email : {user.email} </span>
                           
                        </h1>
                    </div>
            </div>
            </div>
            
  </>,document.getElementById('modal'))
  )
}
