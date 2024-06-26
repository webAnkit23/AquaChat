import React, { useState } from 'react'
import bg from './../utils/bg.mp4' 
import BackgroundVideo from '../components/BackgroundVideo';
import { MdAlternateEmail } from "react-icons/md";
import { MdLockOutline } from "react-icons/md";
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";
import { checkLogin } from '../functions/checkInputs';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useGlobal from '../context/globalContext';
export default function Login({setOpenLogin}) {
  const navigate = useNavigate();
  const [showPassword ,setShowPassword] = useState(false);
  const [email ,setEmail] = useState('gggg@gmail.com');
  const [password,setPassword] = useState('mmmmmm');
  const {setUser} = useGlobal();
  const handleLogin =async() =>{
         if(checkLogin(email ,password,toast)){
          try{
                const {data} = await axios.post('/api' , {email,password});
                localStorage.setItem("AquaUser" , JSON.stringify(data));
                setUser(data);
                toast.success('you are signed in');
                navigate('/chats');
          }
          catch(err){
            console.log(err.response.data);
            toast.error(err.response.data.message);
          }
         }
  }
  return (
   <>
     <BackgroundVideo src={bg}/>


     <div className='center x p-3 bg-white border-2 rounded-lg  shadow-lg select-none w-[370px] max-w-[90%]'>
      <div className='pb-3 border-blue-400 myflex'>
        <h1 style={{fontSize:'35px'}} className='font-bold text-blue-500 textGra2 text-nowrap'>AquaChat Login</h1>
      </div>

      <div className='flex flex-col gap-4 '>
           <div className='pt-2 pb-2 min-w-[100%]'>
                <label className='text-lg '>Email</label>
                <div className='flex items-center gap-2 border-b-2'>
                   <MdAlternateEmail size={20} className='text-gray-600'/>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} type='email' className='p-3 w-[100%] focus:outline-none' placeholder='Enter your Email'/>
                </div>  
           </div>
           <div className='pt-2 pb-2 min-w-[100%]'>
                <label className='text-lg '>Password</label>
                <div className='relative flex items-center gap-2 border-b-2'>
                   <MdLockOutline size={25} className='text-gray-600'/>
                  <input value={password} onChange={(e) => setPassword(e.target.value)} type={showPassword?'text' :'password'} className='p-1 focus:outline-none w-[100%]' placeholder='Type your Password'/>
                  <div className='absolute right-2' onClick={() =>setShowPassword((prev) =>!prev)}>
                      {showPassword?<FiEyeOff className='text-blue-600 ' size={20}/>:<FiEye size={20} className='text-blue-600 '/>}
                      </div>
                </div>  
           </div>
           <button onClick={handleLogin} className='w-[100%] rounded-full mt-5 text-xl text-white hover:scale-[1.04] duration-100 hover:shadow-sm bg h-[40px]'>Login</button>
      </div>

      <div className='mt-4 font-bold text-center textGra'>Jump right back into the conversation with AquaChat - Login Now</div>
        <div className='mt-5 text-sm text-center'>
          <p>
            Don't have an account? <span onClick={()=>setOpenLogin(prev =>!prev)} className='font-semibold border-blue-800 cursor-pointer hover:text-blue-600 hover:border-b-2' >Register</span>
          </p>
        </div>
     </div>
   </>
  )
}
