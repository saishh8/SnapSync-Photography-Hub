import React, { useEffect, useState } from "react";
import axios from "axios";
import { getUsername } from "../helper/helper";
import NavbarP from "./NavbarP";
import { Camera, Image, Calendar, Mail, Award } from "lucide-react";
import moment from "moment";
import { Link } from "react-router-dom";

export default function PhotoHome() {
  const [photographerData, setPhotographerData] = useState({});
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const { email } = getUsername();
    if (email) {
      axios.get(`/user/${email}`)
        .then(res => {
          setPhotographerData(res.data);
          return axios.get(`/api/photographer/${res.data._id}/bookings`);
        })
        .then(bookingsRes => {
          // Filter only confirmed bookings (status: 'booked')
          const confirmedBookings = bookingsRes.data.filter(
            booking => booking.status === 'booked'
          );
          setBookings(confirmedBookings);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, []);

  const upcomingBookings = bookings.filter(booking => 
    moment(booking.startDate).isAfter(moment())
  );

  const completedBookings = bookings.filter(booking => 
    moment(booking.startDate).isBefore(moment())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarP />
      
      <div className="bg-black text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Welcome back, {photographerData.name}</h1>
          <p className="text-gray-400">Let's capture some amazing moments today</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gray-100 rounded-full">
                <Camera className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold">{bookings.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gray-100 rounded-full">
                <Calendar className="w-6 h-6 text-gray-700" />
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
                <Image className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed Sessions</p>
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
                <h2 className="text-2xl font-bold text-gray-900">{photographerData.name}</h2>
                <p className="text-gray-600">Professional Photographer</p>
              </div>
              <div className="mt-4 md:mt-0">
                <Link to='/PHome/profile' className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors">
                  Edit Profile
                </Link>
              </div>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{photographerData.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Award className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-md text-black-900">SnapSync verified</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}