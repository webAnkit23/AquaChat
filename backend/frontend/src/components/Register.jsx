import React, { useRef } from 'react';
import { useState } from 'react';
import { FaRegUser } from "react-icons/fa6";
import { MdLockOutline } from "react-icons/md";
import { FiEye } from "react-icons/fi";
import { MdAlternateEmail } from "react-icons/md";
import { FiEyeOff } from "react-icons/fi";
import { toast } from 'react-toastify';
import { checkinputs } from '../functions/checkInputs';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useGlobal from '../context/globalContext';
import imag from './../utils/gallery.png';
import { MdCloudDone } from "react-icons/md";
export default function Register({setOpenLogin}) {
  const navigate = useNavigate();
  const [showPassword ,setShowPassword] = useState(false);
  const [email ,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [name ,setName] = useState('');
  const ref = useRef();
  const [imageUrl ,setImageUrl] = useState(null);
  const {setUser} = useGlobal();
  console.log(imageUrl);
 async function handleImageUpload(e){
    console.log('a');
    let i = e.target.files[0];
    
    const formData = new FormData();
    formData.append('file', i);
    formData.append('upload_preset', 'puioiycd'); // Replace with your upload preset

    try {
      const {data} = await axios.post(
        `https://api.cloudinary.com/v1_1/dcoekuoxi/image/upload`, // Replace with your cloud name
        formData
       );
     console.log(data);
      setImageUrl(data.secure_url);
    }

    catch (error) {
      console.error("Error uploading image:", error);
    }
  }

  const handleRegister =async () =>{
    console.log('a');
    const res =  checkinputs(email,name,password , toast);
    if(res){
      try{
        const {data} = await axios.post('/api/register' , {name ,email ,password , profilepic:imageUrl||'https://wallpapers-clan.com/wp-content/uploads/2022/09/one-piece-pfp-1.jpg'});
        localStorage.setItem("AquaUser" , JSON.stringify(data));
          setUser(data);
        console.log(data);
        toast.success('you are Signed up');
        navigate('/chats');
      }
      catch(err){
        toast.error(err.response.data.message);
      }
    }
   }
  
  return (
    <div>
      
       <div className='center x p-3 bg-white border-2 rounded-lg shadow-lg select-none w-[400px] max-w-[90%]'>
      <div className='pb-3 border-blue-400 myflex'>
        <h1  className='text-lg font-bold text-center text-blue-500 textGra'>Making waves in messaging – welcome to  
          <span className='text-3xl textGra2'> AquaChat</span></h1>
      </div>
      <div className='flex flex-col gap-4 '>
      <div className='pt-2 pb-2 min-w-[100%]'>
                <label className='text-lg '>Name</label>
                <div className='flex items-center gap-2 border-b-2'>
                   <FaRegUser size={20} className='text-gray-600'/>
                  <input value={name} onChange={(e) => setName(e.target.value)} type='email' className='p-3 w-[100%] focus:outline-none' placeholder='Enter your Name'/>
                </div>  
           </div>
           <div className='pt-2 pb-2 min-w-[100%]'>
                <label className='text-lg '>Email</label>
                <div className='flex items-center gap-2 border-b-2'>
                   <MdAlternateEmail size={20} className='text-gray-600'/>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} type='email' className='p-3 w-[100%] focus:outline-none' placeholder='Enter your Email'/>
                </div>  
           </div>
           <div className='pt-2 pb-2 min-w-[100%]'>
                <label className='mb-2 text-lg '>Password</label>
                <div className='relative flex items-center gap-2 border-b-2'>
                <MdLockOutline size={25} className='text-gray-600'/>
                  
                  <input value={password} onChange={(e) => setPassword(e.target.value)} type={showPassword?'text' :'password'} className='p-1 focus:outline-none w-[100%]' placeholder='Type your Password'/>
                  <div className='absolute right-2' onClick={() =>setShowPassword((prev) =>!prev)}>
                      {showPassword?<FiEyeOff className='text-blue-600 ' size={20}/>:<FiEye size={20} className='text-blue-600 '/>}
                      </div>
                </div>  
           </div>

    
               
                <div className='relative flex items-center justify-between gap-2 '>
                <img src={imag} className='h-[35px] hover:scale-[1.2]  z-10 duration-200 object-cover w-[35px]' onClick={() => ref.current.click()}/>
                <p>{!imageUrl?"upload a Picture":<MdCloudDone className='text-green-400' size={40}/>}</p>
          
        
                     
                  <input ref={ref}  onChange={(e) => handleImageUpload(e)} type='file' className='p-1 opacity-0 absolute  focus:outline-none w-[100%]' placeholder='Upload'/>
                 
                </div>  
           
           <button onClick={handleRegister} className='w-[100%] rounded-full mt-5 text-xl text-white hover:scale-[1.01] duration-100 hover:shadow-sm bg h-[40px]'>Sign up</button>
      </div>
        <div className='text-sm text-center mt-7'>
          <p>
            Already have an account? <span  onClick={()=>setOpenLogin(prev =>!prev)} className='font-semibold border-blue-800 hover:text-blue-600 hover:border-b-2'>Log in</span>
          </p>
        </div>
     </div>
   </div>
  )
}
