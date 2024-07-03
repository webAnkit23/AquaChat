import React ,{useRef, useState}  from 'react';
import * as ReactDOM from 'react-dom';
import { GiCrossMark } from "react-icons/gi";
import axios from 'axios';
import SideBarLoader from '../components/SideBarLoader';
import useGlobal from '../context/globalContext';
import { toast } from 'react-toastify';
export default function GroupModal({setShowGroupModal}) {
    const [members ,setMembers] = useState(new Map());
    const [name ,setName] = useState("");
    const [loading ,setLoading] = useState(false);
    const [result ,setResults] = useState([]);
    const [groupLoading ,setGroupLoading] = useState(false);
    const timer = useRef();
  const { user,setChats} = useGlobal();
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
                    toast.error(err.message);
                 }
                 finally{
                        setLoading(false);
                 }
            },300);
    }

    const addToGroup =async(member) =>{
        
         if(members.has(member._id)||user.id==member._id)return;
         const m = new Map(members);
         m.set(member._id ,member );
         setMembers(m);
         
    }
    const createGroup =async() =>{
       
     if(members.size<2){
        toast.error('Atleast 3 members are needed');
        return;
     }
     if(!name){
        toast.error('Group Name is needed');
        return;
     }
     try{
        setGroupLoading(true);
        const {data} =await axios.post('/api/chats/group',{
            headers:{
                "content-type" : "application.json",
                "authorization" : `Bearer ${user.token}`,
            },
            name,
            members:[...members.values()]
        });
        setChats((prev) => [data , ...prev]);
     }
     catch(err){
        toast.error(err.message);
     }
     finally{
        setGroupLoading(false);
        setName(false);
        setShowGroupModal(false);
     }

       
    }
    const removeFromGroup =(id) =>{
        const n = new Map(members);
        n.delete(id);
        setMembers(n);
    }
    return (
        ReactDOM.createPortal(
           <>
           <div className='h-[100vh] fixed w-[100vw] bg-gray-300 top-0 z-100 opacity-[.5]' onClick={()=> setShowGroupModal(false)}></div>
           <div className='absolute top-[50%] left-[50%] translate-x-[-50%] z-[10000] opacity-1 bg-white translate-y-[-50%] h-auto  w-[300px] border-2 shadow-lg '>
               <div className='flex items-center justify-between p-2 border-b-2 '>
                <h1 className='text-xl font-semibold textGra2'>Add to Group + </h1>
                <GiCrossMark onClick={() =>{
                      setShowGroupModal(false)}} size={30} className='hover:scale-[1.2] hover:text-[#fc00ff] duration-100 text-[#5ADEFF]'/>
               </div>
               <div className='flex flex-wrap items-center gap-2 p-1 mt-1'>
                {[...members.values()].map((member) =>{
                     return <span key={member._id} className='flex animate-pulse p-[2px] pl-2 pr-2 bg items-center rounded-full min-w-[30px] gap-2'><h1 className='font-semibold text-white'>{member.name}</h1> <span><GiCrossMark onClick={() =>removeFromGroup(member._id)} className='text-white cursor-pointer'/></span></span>
})}
            
               </div>
               <div className='flex flex-col gap-2 p-2'>
                    <input className='w-full p-2 border-2 rounded focus:outline-none' value={name} onChange={(e) =>setName(e.target.value)} type='text' placeholder='Group Name'/>
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
               <button disabled ={name===""||members.size<2} onClick={createGroup} className={`flex items-center justify-center p-1 pl-2 pr-2 m-1 text-white bg-blue-600 border-2 rounded-full right-2 ${name===""||members.size<2?'opacity-[.5]':''}`}>Create +</button>
               </div>
              
           </div>
           
           </>,
           document.getElementById('modal')
        )
 )
}
