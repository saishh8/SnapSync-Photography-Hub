import React, { useState, useEffect } from "react";
import NavbarP from "./NavbarP";
import axios from "axios";
import { getUsername } from '../helper/helper';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Request = () => {
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [allRequests, setAllRequests] = useState([]);
  const { id: photographerId } = getUsername();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const TABS = [
    { id: 'all', label: 'All Requests' },
    { id: 'approval', label: 'Pending Approval' },
    { id: 'payment', label: 'Payment Pending' },
    { id: 'booked', label: 'Booked' },
    { id: 'rejected', label: 'Rejected' }
  ];
  const fetchBookings = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/photographer/${photographerId}/bookings?page=${page}&limit=6`);

      // Add proper error handling and fallback values
      const bookings = response.data?.bookings || [];
      const pagination = response.data?.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0
      };

      setRequests(bookings);
      setCurrentPage(pagination.currentPage);
      setTotalPages(pagination.totalPages);
      setTotalItems(pagination.totalItems);

      // Fetch all requests for tab counts (only on first page)
      if (page === 1) {
        try {
          const allResponse = await axios.get(`${API_BASE_URL}/api/photographer/${photographerId}/bookings?page=1&limit=1000`);
          const allBookings = allResponse.data?.bookings || [];
          setAllRequests(allBookings);
        } catch (allError) {
          console.error('Error fetching all requests for tab counts:', allError);
          setAllRequests([]);
        }
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // Set fallback values on error
      setRequests([]);
      setCurrentPage(1);
      setTotalPages(1);
      setTotalItems(0);
      setAllRequests([]);
    } finally {
      setLoading(false);
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
    fetchBookings(currentPage);
  }, [photographerId, currentPage]);

  const handleAccept = async (id) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/photographer/bookings/${id}/respond`, {
        action: 'accepted',
        photographerId
      });
      fetchBookings(currentPage);
    } catch (error) {
      console.error('Error accepting booking:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/photographer/bookings/${id}/respond`, {
        action: 'rejected',
        photographerId
      });
      fetchBookings(currentPage);
    } catch (error) {
      console.error('Error rejecting booking:', error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              1
            </button>
            {startPage > 2 && (
              <span className="px-3 py-2 text-sm text-gray-500">...</span>
            )}
          </>
        )}

        {pages.map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-2 text-sm font-medium rounded-lg border ${currentPage === page
              ? 'bg-gray-900 text-white border-gray-900'
              : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50'
              }`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-3 py-2 text-sm text-gray-500">...</span>
            )}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    );
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
          <div className="flex items-center justify-start md:justify-center space-x-4 bg-gray-100 p-1.5 rounded-full overflow-x-auto whitespace-nowrap scrollbar-hide">
            {TABS.map((tab) => {
              const tabCounts = {
                all: allRequests.length,
                approval: allRequests.filter(r => r.status === 'approval required').length,
                payment: allRequests.filter(r => r.status === 'payment pending').length,
                booked: allRequests.filter(r => r.status === 'booked').length,
                rejected: allRequests.filter(r => r.status === 'rejected').length
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

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-500">Loading requests...</p>
          </div>
        )}

        {/* Requests Grid */}
        {!loading && (
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredRequests && filteredRequests.length > 0 && filteredRequests.map((request) => (
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
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && renderPagination()}

        {/* Results Info */}
        {!loading && (
          <div className="text-center mt-4 text-sm text-gray-500">
            Showing {((currentPage - 1) * 6) + 1} to {Math.min(currentPage * 6, totalItems)} of {totalItems} requests
          </div>
        )}

        {!loading && filteredRequests.length === 0 && (
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