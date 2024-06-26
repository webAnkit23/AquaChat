import { useContext ,createContext ,useEffect ,useRef } from "react";

import {io} from 'socket.io-client';
import useGlobal from "./globalContext";
const socketContext = createContext();

export const useSocket = () =>   useContext(socketContext);

export const SocketProvider = ({children}) =>{
   let socket = useRef(null);
   const {user} = useGlobal();
 useEffect(() =>{
       if(user==null)return;
       socket.current = io('/');

       socket.current.on('connect' ,() =>{
           console.log('connected');

           socket.current.emit("userConnected" , user.id);
              
       });
         return () => {
            if (socket.current) {
              socket.current.disconnect();
            }
          };
 },[user,socket])

return <socketContext.Provider value={socket.current}>
               {children}
         </socketContext.Provider>
}
