import React,{lazy, useState} from 'react'
import bg from './../utils/bg.mp4'
const Login = lazy(() => import('./../components/Login.jsx'));
const Register = lazy(() => import('./../components/Register.jsx'));
import BackgroundVideo from '../components/BackgroundVideo.jsx';
import useCheckUser from '../hooks/useCheckUser.js';

export default function Home() {
  const [openLogin , setOpenLogin] = useState(true);
  useCheckUser();
  return (
    <div>
       <BackgroundVideo src={bg}/>
       {openLogin?<Login setOpenLogin = {setOpenLogin}/> :<Register setOpenLogin = {setOpenLogin}/>}
    </div>
  )
}
