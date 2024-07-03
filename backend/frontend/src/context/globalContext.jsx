import { createContext, useContext,  useState } from "react";


const globalContext = createContext();


const useGlobal = () =>useContext(globalContext);
export const ContextProvider =({children}) =>{
    const [user ,setUser] = useState(null);
    const [chats ,setChats] = useState(null);
    const [selectedChat , setSelectedChat] = useState(null);
    const [notifications ,setNotifications] = useState(new Map());
    return <globalContext.Provider value={{user ,setUser,chats ,notifications ,setNotifications ,setChats,selectedChat , setSelectedChat}}>
        {children}
    </globalContext.Provider>

}
export default useGlobal;