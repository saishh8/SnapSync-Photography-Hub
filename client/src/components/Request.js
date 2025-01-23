import React, { useState, useEffect } from "react";
import NavbarP from "./NavbarP";
import axios from "axios";
import { getUsername } from '../helper/helper';

const Request = () => {
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const { id: photographerId } = getUsername();

  const TABS = [
    { id: 'all', label: 'All Requests' },
    { id: 'approval', label: 'Pending Approval' },
    { id: 'payment', label: 'Payment Pending' },
    { id: 'booked', label: 'Booked' },
    { id: 'rejected', label: 'Rejected' }
  ];
  const fetchBookings = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/photographer/${photographerId}/bookings`);
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };
  const filteredRequests = requests.filter(request => {
    if (activeTab === 'all') return true;
    if (activeTab === 'approval') return request.status === 'approval required';
    if (activeTab === 'payment') return request.status === 'payment pending';
    if (activeTab === 'booked') return request.status === 'booked';
    if (activeTab === 'rejected') return request.status === 'rejected';
    return false;
  });
  useEffect(() => {
    fetchBookings();
  }, [photographerId]);

  const handleAccept = async (id) => {
    try {
      await axios.patch(`http://localhost:4000/api/photographer/bookings/${id}/respond`, {
        action: 'accepted',
        photographerId
      });
      fetchBookings();
    } catch (error) {
      console.error('Error accepting booking:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.patch(`http://localhost:4000/api/photographer/bookings/${id}/respond`, {
        action: 'rejected',
        photographerId
      });
      fetchBookings();
    } catch (error) {
      console.error('Error rejecting booking:', error);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'approval required':
        return 'bg-yellow-100 text-yellow-800';
      case 'payment pending':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarP />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Booking Requests
        </h1>
        
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 bg-gray-100 p-1.5 rounded-full">
            {TABS.map((tab) => {
              const tabCounts = {
                all: requests.length,
                approval: requests.filter(r => r.status === 'approval required').length,
                payment: requests.filter(r => r.status === 'payment pending').length,
                booked: requests.filter(r => r.status === 'booked').length,
                rejected: requests.filter(r => r.status === 'rejected').length
              };

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                    ${activeTab === tab.id 
                      ? 'bg-gray-900 text-white shadow-md' 
                      : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'}
                  `}
                >
                  {tab.label}
                  {tab.id !== 'all' && (
                    <span className={`
                      ml-2 py-0.5 px-2 rounded-full text-xs
                      ${activeTab === tab.id 
                        ? 'bg-white/20 text-white' 
                        : 'bg-gray-200 text-gray-600'}
                    `}>
                      {tabCounts[tab.id]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredRequests.map((request) => (
            <div
              key={request._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-md"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {request.userId ? `${request.userId.fname} ${request.userId.lname}` : 'Unknown Client'}
                  </h2>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadgeColor(request.status)}`}>
                    {request.status}
                  </span>
                </div>
                
                <div className="space-y-2 mb-6">
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium">Service:</span> {request.serviceName}
                  </p>
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium">Date:</span> {request.startDate}
                  </p>
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium">Time:</span> {request.startTime} - {request.endTime}
                  </p>
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium">Duration:</span> {request.duration} hour(s)
                  </p>
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium">Price:</span> ₹{request.totalPrice}
                  </p>
                </div>
                
                {request.status === 'approval required' && (
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleAccept(request._id)}
                      className="flex-1 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(request._id)}
                      className="flex-1 bg-white text-gray-900 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
            No booking requests found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Request;