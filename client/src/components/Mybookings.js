import React from 'react'
import Navbar3 from './Navbar3';

import { useEffect, useState } from "react";
import axios from "axios";


import { getUsername } from "../helper/helper";

export default function Mybookings() {
  const { id } = getUsername();
  const [bookings, setBookings] = useState([]); // State to store the fetched bookings

  useEffect(() => {
    axios.get(`http://localhost:4000/bookings/${id}`)
      .then((response) => {
        // Set the fetched bookings to the state
        console.log('Bookings data:', response.data);
        setBookings(response.data);
        
      })
      .catch((error) => {
        console.error('Error fetching profile description:', error);
      });
  }, [id]); // Add 'id' as a dependency to fetch data when 'id' changes

  return (
    <div>
      <Navbar3 />
      <h1 className="font-bold text-3xl text-center mt-4">My Bookings</h1>
      <div className="flex flex-wrap justify-center gap-4 p-4">
        {bookings.map((booking) => (
          <div key={booking._id} className="bg-white shadow-md rounded-lg overflow-hidden w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
            {/* Card Content */}
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">Service Name: {booking.serviceName}</h2>
              <p className="text-gray-600">Start Date: {booking.startDate}</p>
              <p className="text-gray-600">End Date: {booking.endDate}</p>
              <div className="flex items-center mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-700">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
                <span className="ml-2 text-xl font-semibold">Total Price: ${booking.totalPrice}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// import {useEffect, useState} from "react";
// import axios from "axios";

// import {Link, useParams} from "react-router-dom";
// import BookingDates from "../BookingDates";
// import { getUsername } from "../helper/helper";
// export default function BookingsPage() {
// const {id}=getUsername();
//   useEffect(() => {
//     axios.get(http://localhost:4000/bookings/${id})
//       .then((response) => {
        
//       })
//       .catch((error) => {
//         console.error('Error fetching profile description:', error);
//       });
//   }, []);
//   return (
//     <div>
    
//       <div>
//         {bookings?.length > 0 && bookings.map(booking => (
//           <Link to={/account/bookings/${booking._id}} className="flex gap-4 bg-gray-200 rounded-2xl overflow-hidden">
//             <div className="w-48">
//               <img place={booking.place} />
//             </div>
//             <div className="py-3 pr-3 grow">
//               <h2 className="text-xl">{booking.place.title}</h2>
//               <div className="text-xl">
//                 <BookingDates booking={booking} className="mb-2 mt-4 text-gray-500" />
//                 <div className="flex gap-1">
//                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
//                   </svg>
//                   <span className="text-2xl">
//                     Total price: ${booking.price}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }