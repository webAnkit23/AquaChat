import React from 'react'
import * as ReactDOM from 'react-dom';
import group from './../utils/group.png'
import { GiCrossMark } from 'react-icons/gi';
import admin from './../utils/protection.png'
export default function GroupInfoModal({setShowGroupModal,selectedChat}) {
  console.log(selectedChat);
  return (
    ReactDOM.createPortal(
        <>
            <div className='h-[100vh] fixed w-[100vw] gray top-0 z-[100] opacity-[.5]' onClick={()=> setShowGroupModal(false)}></div>
            <div className='absolute overflow-y-auto w-[100vw] md:w-max h-full top-[50%] left-[50%] translate-x-[-50%] z-[1000] opacity-[1] bg-white translate-y-[-50%] md:h-auto   border-2 shadow-lg '>
                  
                  <div className='md:min-w-[300px]'>
                       <div className='relative flex items-center gap-2 p-1 pt-3 border-b-2'>
                        <div className='rounded-full '>
                        <img src={group} className='w-[80px] h-[80px]  bg object-cover rounded-full'/>
                        </div>
                        <h1 className='text-[30px] mb-2 textGra2'>{selectedChat.chatName}</h1>
                        <GiCrossMark onClick={() => setShowGroupModal(false)} size={30} className='hover:scale-[1.2] hover:text-[#fc00ff] duration-100 text-[#5ADEFF] absolute right-2 top-3 md:top-2'/>

                          <div className='absolute flex items-end justify-end font-semibold right-2 bottom-2 textGra'>
                            <span className='text-sm '>Created At : {new Date(selectedChat.createdAt).toDateString()}</span>
                            
                          </div>
                       </div>

                       <div>
                            <div className='flex items-center gap-2 border-b-2 '>
                                 <img className='h-[60px] w-[60px]' src={admin} />
                                 <h1 className='flex items-center text-[20px] gap-1'>
                                  ADMIN : 
                                 <p className=' textGra2'>  {selectedChat?.admin?.name?.toUpperCase()}</p>
                                 </h1>
                              </div> 

                              <div className='flex flex-col gap-3 '>
                                <h1 className='p-1 text-xl text-white border-b-2 bg'>Members</h1>
                                <div className='md:max-h-[300px] overflow-auto'>

                               
                                 {
                                  selectedChat.members.map((member,i) =>{
                                    return <div className='p-1 border-b-2' key={member._id}>
                                        {
                                         
                                          <div className='flex items-center gap-2 '>
                                 <img className='h-[70px] rounded-full w-[70px]' src={member.profilepic} />
                                
                                  <div className='break-all text-wrap'>
                                 <h1 className='md:text-[20px] text-wrap break-words textGra2'>  {member.name.toUpperCase()}</h1>
                                 <h1 className='text-sm md:text-md'>Email : {member.email}</h1>
                                 </div>
                                 
                              </div> 
                                        
                                        }
                                    </div>
                                  })
                                 }
                                  </div>
                                

                              </div>
                            
                       </div>

                  </div>
                        

              </div>
              
        
        </> , document.getElementById('modal')
        )
  )
}
