import React, { useEffect, useState } from "react";
import { getUsername } from "../helper/helper";
import axios from "axios";
import Navbar3 from "./Navbar3";
import { Calendar, Mail, Clock, User } from "lucide-react";
import moment from "moment";
import { Link } from "react-router-dom";
export default function UserProfile() {
  const [clientData, setClientData] = useState({});
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const { email } = getUsername();
    if (email) {
      // Fetch client data
      axios.get(`/client/${email}`)
        .then(res => {
          setClientData(res.data);
          
          // Fetch bookings for the client
          return axios.get(`/bookings/${res.data._id}?all=true`);
        })
        .then(bookingsRes => {
            console.log("Raw bookings response:", bookingsRes.data);
            // Filter only confirmed bookings (status: 'booked')
            const confirmedBookings = bookingsRes.data.bookings.filter(
              booking => booking.status === 'booked'
            );
            setBookings(confirmedBookings);
            confirmedBookings.forEach((booking, i) => {
  const datetime = `${booking.startDate} ${booking.startTime}`;
  const parsed = moment(datetime, 'YYYY-MM-DD HH:mm');
  console.log(`Booking #${i + 1}`, {
    raw: datetime,
    parsed: parsed.format(),
    isValid: parsed.isValid(),
    now: moment().format(),
    isFuture: parsed.isSameOrAfter(moment())
  });
});

          })
        .catch(error => {
          console.log(error);
        });
    }
  }, []);

  // Calculate booking statistics
  const upcomingBookings = bookings.filter(booking => 
  moment(`${booking.startDate} ${booking.startTime}`, 'YYYY-MM-DD HH:mm').isSameOrAfter(moment())
);


  const completedBookings = bookings.filter(booking => 
  moment(`${booking.startDate} ${booking.startTime}`, 'YYYY-MM-DD HH:mm').isBefore(moment())
);


  const nextSession = upcomingBookings.length > 0 
  ? moment(`${upcomingBookings[0].startDate} ${upcomingBookings[0].startTime}`, 'YYYY-MM-DD HH:mm').format('MMM DD')
  : 'No upcoming sessions';


  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar3 />
      
      <div className="bg-black text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">
            Welcome, {clientData.fname} {clientData.lname}
          </h1>
          <p className="text-gray-400">View your photography sessions and manage bookings</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gray-100 rounded-full">
                <Calendar className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Next Session</p>
                <p className="text-2xl font-bold">{nextSession}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gray-100 rounded-full">
                <Clock className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Upcoming Sessions</p>
                <p className="text-2xl font-bold">{upcomingBookings.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gray-100 rounded-full">
                <Clock className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Sessions Completed</p>
                <p className="text-2xl font-bold">{completedBookings.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-12">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Account Details</h2>
                <p className="text-gray-600">Manage your profile and preferences</p>
              </div>
              <div className="mt-4 md:mt-0">
                <Link to='/Cards'className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors">
                  Book Session
                </Link>
              </div>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">
                    {clientData.fname} {clientData.lname}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{clientData.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}