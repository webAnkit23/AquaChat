import React, { useRef } from 'react'
import { useState } from 'react';
import { GiCrossMark } from "react-icons/gi";
import * as ReactDOM from 'react-dom';
import axios from 'axios';
import SideBarLoader from '../components/SideBarLoader';
import useGlobal from '../context/globalContext';
import { toast } from 'react-toastify';
import { renameGroup ,addMembers ,removeMembers } from '../functions/groupEdits';

export default function EditGroupModal({setShowGroupModal,selectedChat}) {
   
    const [members ,setMembers] = useState(new Map(selectedChat.members.map(obj => [obj._id, obj])));
    const [name ,setName] = useState(selectedChat.chatName);
    const [loading ,setLoading] = useState(false);
    const { user,chats,setSelectedChat} = useGlobal();
    const [result ,setResults] = useState([]);
  const timer = useRef();

    const handleChange =async(e) =>{
        if(timer.current){
            clearTimeout(timer.current);
        }
        if(!e.target.value){
            clearTimeout(timer.current);
            setLoading(false);
            setResults([]);
            return;
        }
        setLoading(true);
        timer.current = setTimeout(async() =>{
            try{
               
                    const {data} =await axios.get(`/api?search=${e.target.value}` ,{
                      headers :{
                        "Content-Type" : 'application/json',
                        "authorization" :  `Bearer ${user.token}`
                      }
                    });
                    setResults(data);

                   
             }
             catch(err){
               // toast.error(err.message);
             }
             finally{
                    setLoading(false);
             }
        },300);
}
    const removeFromGroup =(id) =>{
        const map =new Map(members);
        map.delete(id);
        setMembers(map);
    }
    const addToGroup =(res) =>{
        const map =new Map(members);
        
             map.set(res._id ,res);
             setMembers(map);
    }
    const updateGroup =async() =>{
         let newMembers =[];
         let deletedMembers =[];
       
         selectedChat.members.forEach((m) =>{
          if(!members.has(m._id)&&selectedChat.admin._id!==m._id){
                  deletedMembers.push(m);
                  members.delete(m._id);
          }
          
         })
         newMembers=[...members.values()];
         
         try{
          const data =  await Promise.all([addMembers(newMembers,selectedChat._id,user.token ) , removeMembers(deletedMembers,selectedChat._id,user.token) ,renameGroup(name , selectedChat._id,user.token)]);
       
 
          setSelectedChat(data[2]||data[1]||data[0]||null);
             if(selectedChat!=null){
              chats.forEach((chat,i) =>{
                if(chat._id==selectedChat._id){
                     chats[i].chatName =selectedChat.chatName;
                }
              })
             }
          

         }
         catch(err){
               toast.error(err.message);
         }
         finally{
               setShowGroupModal(false); 
         }
    }
    return (
        ReactDOM.createPortal(
           <>
           <div className='h-[100vh] fixed w-[100vw] gray top-0 z-[100] opacity-[.5]' onClick={()=> setShowGroupModal(false)}></div>
           <div className='absolute top-[50%] left-[50%] translate-x-[-50%] z-[1000] opacity-[1] bg-white translate-y-[-50%] h-auto  w-[300px] border-2 shadow-lg '>
               <div className='flex items-center justify-between p-2 border-b-2 '>
                <h1 className='text-xl font-semibold textGra2'>Edit Group + </h1>
                <GiCrossMark onClick={() =>{
                      setShowGroupModal(false)}} size={30} className='hover:scale-[1.2] hover:text-[#fc00ff] duration-100 text-[#5ADEFF]'/>
               </div>
               <div className='flex flex-wrap items-center gap-2 p-1 mt-1'>
                {[...members.values()].map((member) =>{
                     return <span key={member._id} className='flex  p-[2px] pl-2 pr-2 bg items-center rounded-full min-w-[30px] gap-2'><h1 className='font-semibold text-white'>{member.name}</h1> <span><GiCrossMark onClick={() =>removeFromGroup(member._id)} className='text-white cursor-pointer'/></span></span>
})}
            
               </div>
               <div className='flex flex-col gap-2 p-2'>
                    <input className='w-full p-2 border-2 rounded focus:outline-none' value={name} onChange={(e) =>setName(e.target.value)} type='text' placeholder='New Name' />
                    <input className='w-full p-2 border-2 rounded focus:outline-none' onChange={(e) =>handleChange(e)} type='text' placeholder='Add users to Group'/>
               </div>
               {loading?<SideBarLoader /> : <div className='max-h-[150px] overflow-y-auto'>
                   {result.map((res,i) =>{
                 return  <div key={res._id} onClick={() =>addToGroup(res)}>
                   <div className={`relative flex items-center gap-3 ${members.has(res._id)?'bg-gray-200 opacity-[.5]':'hoverEffect'} p-2 duration-150 border-b-2 border-blue-400 cursor-pointer `}>
           <div className=''>
             <img className='h-[50px] rounded-full w-[50px] object-cover' src={res.profilepic}/>
           </div>
     <div>
      <h1 className='font-semibold'>{res.name.substring(0,20)}</h1>
    </div>
</div>
                 </div> 
})}
               
               </div>}
               <div className='flex items-center justify-end'>
               <button disabled ={name===""||members.size<2}  className={`flex items-center justify-center p-1 pl-2 pr-2 m-1 text-white bg-blue-600 border-2 rounded-full right-2 ${name===""||members.size<2?'opacity-[.5]':''}`} onClick={updateGroup}>Edit Group</button>
               </div>
              
           </div>
           
           </>,
           document.getElementById('modal')
        )
 )
}
