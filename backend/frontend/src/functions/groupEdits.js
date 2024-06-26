import axios from "axios"
//groupId , memberIds
export const addMembers =async(memberIds , chatId ,token) =>{
    if(memberIds.length==0)return;
   
       try{
                const {data} = axios.put('/api/chats/group/add' ,{
                        headers :{
                            "content-type" : "application/json",
                            "authorization": `Bearer ${token}`
                        },
                        groupId : chatId,
                        memberIds
                });
                return data;
       }
       catch(err){
             throw new Error(err?.response?.data?.message||'Some error occured');
       }      
};
export const removeMembers =async(memberIds , chatId ,token) =>{
    if(memberIds.length==0)return;
    try{
             const {data} =await axios.put('/api/chats/group/remove' ,{
                     headers :{
                         "content-type" : "application/json",
                         "authorization": `Bearer ${token}`
                     },
                     groupId : chatId,
                     memberIds
             });
            return data;
    }
    catch(err){
        throw new Error(err?.response?.data?.message||'Some error occured');
    }      
};
export const renameGroup =async(chatName, groupId,token) =>{
    try{
             const {data} =await axios.put('/api/chats/group/rename' ,{
                     headers :{
                         "content-type" : "application/json",
                         "authorization": `Bearer ${token}`
                     },
                    chatName,
                    groupId
                     
             });
             return data;
             
    }
    catch(err){
        throw new Error(err?.response?.data?.message||'Some error occured');
    }      
};