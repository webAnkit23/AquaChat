import React from 'react'
import { FcSearch } from "react-icons/fc";
export default function InputField({setShowSideBar}) {
  return (
    <div onClick={() =>setShowSideBar((true))} className='flex items-center justify-center gap-2 p-1 bg-blue-500 rounded bg h-fit'>
                        <FcSearch size={30}/>
                        <input  type='text' placeholder='Search' className='bg-transparent lg:flex w-[200px] hidden  items-center focus:outline-none'/>
                    </div>
  )
}
