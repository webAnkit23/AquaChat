import { useNavigate } from "react-router-dom";
import useGlobal from "../context/globalContext";
import { useEffect } from "react";

function useCheckUser(){
const navigate = useNavigate();
const {user,setUser} = useGlobal();

useEffect(()=>{
  const data = JSON.parse(localStorage.getItem("AquaUser"));
  if(!data&&!user){
    navigate('/');
    return;
  }
  if(data){
  setUser(data);
  navigate('/chats');
  }
},[]);


}
export default useCheckUser;