"use client"
import React, { useEffect } from 'react'
import { SIDE_MENU_DATA } from '../assets/data'
import { User } from 'lucide-react';
import  Link  from 'next/link';
import { useAuthstore } from '../store/useAuthstore';
import { usePathname } from 'next/navigation';
const SideMenu = () => {
    const {authUser,checkAuth} = useAuthstore();

    const pathName = usePathname();
 
    
    const activeMenu = pathName.split("/")[2];
 
    

   


  return (
    <div>
        
        <div className='w-64 h-[calc(100vh-61px)]  border-r border-gray-200/50 p-5 sticky top-[61px] z-20'>

        <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
            {
                authUser?.imageUrl?(
                    <img src={authUser?.imageUrl || ""}  alt='profile-image' className='w-20 h-20 bg-slate-400 rounded-full' />

                ):(
                    <User className='w-20 h-20 text-xl' />

                )
            }
              <h5 className='text-white font-semibold leading-6'> { authUser?.fullName}</h5>
        </div>

        {SIDE_MENU_DATA.map((item) => (
            <div key={item.id} className='mb-1'>
                <Link href={item.path} className={`flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-100 transition-colors
                 ${activeMenu === item.path.split("/")[2] ? 'bg-purple-500 text-white hover:bg-purple-600 font-medium' : 'font-normal text-yellow-700 hover:text-gray-900'}`}>
                    <item.icon className='text-lg'/>
                    <span className='font-medium '>{item.label}</span>
                </Link>
            </div>
        ))}

        
      


        </div>

      
    </div>
  )
}

export default SideMenu
