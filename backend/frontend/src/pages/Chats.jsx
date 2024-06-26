import React ,{useEffect, useState} from 'react';
import Navbar from '../components/Navbar';
import SideBar from './../components/SideBar';
import AllChats from '../components/AllChats';
import MessagePortal from '../components/MessagePortal';
import useCheckUser from '../hooks/useCheckUser';
import useGlobal from '../context/globalContext';
import { SocketProvider } from '../context/socketContext';
export default function Chats() {
  const [showSideBar , setShowSideBar] = useState(false);
     useCheckUser();
     const {selectedChat} = useGlobal();
  
  return (
    <SocketProvider>
    <div>
      <div>
       <Navbar setShowSideBar={setShowSideBar}/>
       <SideBar showSideBar={showSideBar} setShowSideBar ={setShowSideBar}/>
      </div>
        <div className={` md:grid   md:grid-cols-[350px_1fr]  `}>
          <div className={`${selectedChat?'hidden md:block':''}`}>
              <AllChats /> 
          </div>
            <div className={`${!selectedChat?'':'flex flex-col'}`}>
            <MessagePortal />
            </div>
        </div>
    </div>
    </SocketProvider>
  )
}
