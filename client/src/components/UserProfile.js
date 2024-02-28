import React from 'react'
import { getUsername } from '../helper/helper';
import axios from 'axios';
import { useState,useEffect } from 'react';
import Navbar3 from './Navbar3';

export default function UserProfile() {



    const [clientData, setClientData] = useState({});
  

    useEffect( ()=>{
        const {email} = getUsername();
        console.log(email);
        if (email){
            axios.get(`/client/${email}`)
            .then(res=>{
                setClientData(res.data);
            })
            .catch(error => {
                console.log(error)
              });
            } else {
                console.log('email not found')
            }
            //return () => {};
          }, []);
  return (
    <div>



<Navbar3/>
        
  
    
        <div className="flex flex-col justify-center items-center h-[100vh]">
            <div className="relative flex flex-col items-center rounded-[20px] w-[400px] mx-auto p-4 bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:!shadow-none">
                <div className="relative flex h-32 w-full justify-center rounded-xl bg-cover" >
                    <img src='https://horizon-tailwind-react-git-tailwind-components-horizon-ui.vercel.app/static/media/banner.ef572d78f29b0fee0a09.png' className="absolute flex h-32 w-full justify-center rounded-xl bg-cover"/> 
                    
                </div> 
                <div className="mt-16 flex flex-col items-center">
                    <h4 className="text-xl font-bold text-navy-700 dark:text-black">
                   { clientData.fname} { clientData.lname}
                    </h4>
                    <p className="text-base font-normal text-gray-600">SnapSync Client</p>
                </div> 
                <div className="mt-6 mb-3 flex gap-14 md:!gap-14">
                    
                    <div className="flex flex-col items-center justify-center">
                    <p className="text-2xl font-bold text-navy-700 dark:text-black">
                   e-mail
                    </p>
                    <p className="text-sm font-normal text-gray-600"> { clientData.email}</p>
                    </div>
                </div>
            </div>  
            
        </div>
  

      
    </div>
  )
}
