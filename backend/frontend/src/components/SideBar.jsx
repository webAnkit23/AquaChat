import React ,{useEffect, useRef, useState} from 'react'
import { FcSearch } from "react-icons/fc";
import { GiCrossMark } from "react-icons/gi";
import SideBarLoader from './SideBarLoader';
import useGlobal from '../context/globalContext';
import { toast } from 'react-toastify';
import axios from 'axios';
export default function SideBar({showSideBar,setShowSideBar}) {
  const [search ,setSearch] = useState("");
  const [loading ,setLoading] = useState(false);
  const [result ,setResults] = useState([]);
  const {user,chats,setChats,setSelectedChat} = useGlobal();
  const inputRef = useRef();
  useEffect(()=>{
    inputRef.current.focus();
},[]);
const handleCreateChat =async(id) =>{
  if(chats!=null){
    const existingChat = chats.find((c) =>{
      if(c.isGroupChat)return false;
          return c.members[0]._id==id||c.members[1]._id==id;
    });
   if(existingChat){
    setSelectedChat(existingChat);
    setResults([]);
    setShowSideBar(false);
    return;
   }
    
  }

 console.log(id);
    try{
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${user.token}`
        },
      userId:id
      };
        const {data} =await axios.post('/api/chats',config)
      setChats((prev) => [...prev , data]);
        setSelectedChat(data);  
        setShowSideBar(false);
    }
    catch(err){
      toast.error(err.message);
    }
}

  const handleSearch =async() =>{
    if(!search)return;
     try{
        setLoading(true);
            const {data} =await axios.get(`/api?search=${search}` ,{
              headers :{
                "Content-Type" : 'application/json',
                "authorization" :  `Bearer ${user.token}`
              }
            });
            setResults(data);
            console.log(data);
     }
     catch(err){
        toast.error(err.message);
     }
     finally{
            setLoading(false);
            setSearch('');
     }
  }


  return (
    <div className={`${showSideBar?'translate-x-0':'translate-x-[-350px]'} z-[1000] pt-4 duration-300 absolute top-0 h-[100%] w-[300px] bg-white p-2 shadow-lg`}>
           <div className='pb-3 border-b-2' >
                 <div className='flex items-center justify-between pb-2'>
                    <h1 className='mb-2 text-2xl font-semibold textGra2'>AquaChat</h1>
                    <GiCrossMark onClick={() =>{
                      setResults([]);
                      setShowSideBar(false)}} size={30} className='hover:scale-[1.2] hover:text-[#fc00ff] duration-100 text-[#5ADEFF]'/>
                 </div>
              
                 <div  className='flex items-center gap-2 rounded h-fit'>
                       
                        <input ref={inputRef} onChange={(e) =>setSearch(e.target.value)} value={search}  type='text' placeholder='Search' className='bg-blue-500 rounded bg w-[100%] p-2 flex   items-center focus:outline-none'/>
                        <FcSearch size={30} onClick={handleSearch}/>
                    </div>     
           </div>
           <div className='flex flex-col gap-3 mt-3 max-h-[80vh] overflow-y-auto ml-1 pr-1'>
                        {loading?<Loader />:
                        result.map((us) =>{
                          return <div key={us._id} onClick={() =>handleCreateChat(us._id)}>
                            <div className='relative flex items-center gap-3 p-2 duration-150 border-b-2 cursor-pointer hoverEffect'>
                    <div className=''>
                      <img className='h-[50px] rounded-full w-[50px] object-cover' src={us.profilepic}/>
                    </div>
              <div>
               <h1 className=''>{us.name.substring(0,20)}</h1>
               <h1 className='flex items-center justify-center'><span className='font-semibold'>Email:</span><span className='font-normal'>{us.email.substring(0,20)}</span></h1>
             </div>
    </div>
                          </div>
                        })
                        }
                        
                    </div>
    </div>
  )
}

function Loader(){
  return <>
  <SideBarLoader />
                        <SideBarLoader />
                        <SideBarLoader />
                        <SideBarLoader />
                        <SideBarLoader />
                        </>
}