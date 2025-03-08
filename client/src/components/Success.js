import axios from 'axios';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {Link, useNavigate} from "react-router-dom";

function Success() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const serviceName = params.get('serviceName');
  const price = params.get('price');
  const ownerId = params.get('ownerId');
  const userId = params.get('userId');
  const startDate = params.get('startDate');
  const startTime = params.get('startTime')

  useEffect(() => {
    // Make an API call to create the booking using Axios
    axios.post('/create-booking', {
        userId,
        photographerId: ownerId, // Assuming ownerId is the photographer's ID
        serviceName,
        totalPrice: price,
        startDate,
        startTime,
      })
      .then((response) => {
        // Handle the response (you can redirect to a thank you page or show a confirmation message)
        console.log('Booking created:', response.data.booking);
        // Redirect to a thank you page
        //history.push('/thank-you');
      })
      .catch((error) => {
        console.error('Error creating booking:', error);
        // Handle the error (e.g., show an error message)
      });
  }, []);

  return (
    <div className='text-center'>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: ' 20vh' }}>
  <svg className="w-10 h-10 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
    <path fill="currentColor" d="m18.774 8.245-.892-.893a1.5 1.5 0 0 1-.437-1.052V5.036a2.484 2.484 0 0 0-2.48-2.48H13.7a1.5 1.5 0 0 1-1.052-.438l-.893-.892a2.484 2.484 0 0 0-3.51 0l-.893.892a1.5 1.5 0 0 1-1.052.437H5.036a2.484 2.484 0 0 0-2.48 2.481V6.3a1.5 1.5 0 0 1-.438 1.052l-.892.893a2.484 2.484 0 0 0 0 3.51l.892.893a1.5 1.5 0 0 1 .437 1.052v1.264a2.484 2.484 0 0 0 2.481 2.481H6.3a1.5 1.5 0 0 1 1.052.437l.893.892a2.484 2.484 0 0 0 3.51 0l.893-.892a1.5 1.5 0 0 1 1.052-.437h1.264a2.484 2.484 0 0 0 2.481-2.48V13.7a1.5 1.5 0 0 1 .437-1.052l.892-.893a2.484 2.484 0 0 0 0-3.51Z"/>
    <path fill="#fff" d="M8 13a1 1 0 0 1-.707-.293l-2-2a1 1 0 1 1 1.414-1.414l1.42 1.42 5.318-3.545a1 1 0 0 1 1.11 1.664l-6 4A1 1 0 0 1 8 13Z"/>
  </svg>
  
</div>


    
      <h1 className='text-center text-3xl font-semibold'>Payment Successful</h1>
      <p className='text-center text-2xl font-semibold'>Service Name: {serviceName}</p>
      <p className='text-center text-2xl font-semibold'>Price: ₹{price}   </p>
      <p className='text-center text-2xl font-semibold'>Start Date:{startDate}</p>
      <p className='text-center text-2xl font-semibold'>Start Time:{startTime}</p>
      {/* <p className='text-center text-2xl font-semibold'>End Date:{endDate}</p> */}
      {/* Add more content here */}
     

      <div className='title flex flex-col my-5 items-center'><Link className="underline text-black" to={'/CHome'}>Back to Profile</Link></div>
    </div>
  );
}

export default Success;
//With this approach, you can pass multiple pieces of information as a single object and easily access specific properties on the success page.