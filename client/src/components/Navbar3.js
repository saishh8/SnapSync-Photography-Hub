import React from 'react';
import {Link, useNavigate} from "react-router-dom";
import { getUsername } from '../helper/helper';
export default function Navbar3() {
  const navigate = useNavigate()
  const { id } = getUsername();
  function userLogout()
{
  localStorage.removeItem('token')
  navigate('/')
}
  return (
    <div>
      <nav className="font-sans flex flex-col text-center content-center sm:flex-row sm:text-left sm:justify-between py-2 px-6 bg-gray-300 shadow-md sm:items-baseline w-full">
        <div className="mb-2 sm:mb-0 inner">
          <a  className="text-2xl no-underline text-gray-800 hover:text-blue-300 font-sans font-bold">SnapSync</a><br/>
          {/* <span className="text-xs text-gray-600">Beautiful New Tagline</span> */}
        </div>
        <div className="sm:mb-0 self-center">
          <div className="h-10">
            {/* Change bookings URL */}
            <Link  className="text-md no-underline text-gray-600 hover:text-red-500 ml-2 px-1" to={`/bookings/${id}`}>Bookings</Link> 
            <Link  className="text-md no-underline text-gray-600 hover:text-red-500 ml-2 px-1" to={'/CHome'}>Profile</Link>
            <Link  className="text-md no-underline text-gray-600 hover:text-red-500 ml-2 px-1" to={'/Cards'}>Services</Link>
            <button onClick={userLogout} className="text-md no-underline text-gray-600 hover:text-red-500 ml-2 px-1">Logout</button>
          </div>
        </div>
      </nav>
    </div>
  );
}
