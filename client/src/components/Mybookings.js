import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar3 from './Navbar3';
import { getUsername } from "../helper/helper";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe("pk_test_51O2C7vSFVwLZwqIqjaMnygaWOBS5WLvW4cBMNDvx8Q6hGjWfirZc3FDYrLm0HmQDfq1dgl6xl3kA8UOJR78V7PnL00N0pwoVED");

const TABS = [
  { id: 'all', label: 'All Bookings' },
  { id: 'approval', label: 'Pending Approval' },
  { id: 'payment', label: 'Payment Pending' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'rejected', label: 'Rejected' }
];

export default function Mybookings() {
  const { id } = getUsername();
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(false);
  const [paymentLoadingId, setPaymentLoadingId] = useState(null)

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:4000/bookings/${id}`)
      .then((response) => {
        setBookings(response.data);
      })
      .catch((error) => {
        console.error('Error fetching bookings:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handlePayment = async (booking) => {
    try {
      setPaymentLoadingId(booking._id);
      const response = await axios.post('http://localhost:4000/api/create-checkout-session', {
        serviceName: booking.serviceName,
        price: booking.totalPrice,
        ownerId: booking.photographerId,
        userId: id,
        startDate: booking.startDate,
        startTime: booking.startTime,
        endTime: booking.endTime,
        duration: booking.duration
      });

      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
          sessionId: response.data.id
        });
        if (error) console.error('Error redirecting to checkout:', error);
      }
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setPaymentLoadingId(null);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true;
    if (activeTab === 'approval') return booking.status === 'approval required';
    if (activeTab === 'payment') return booking.status === 'payment pending';
    if (activeTab === 'confirmed') return booking.status === 'booked';
    if (activeTab === 'rejected') return booking.status === 'rejected';
    return false;
  });

  const BookingCard = ({ booking }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-md">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {booking.photographerProfile?.title || 'Photographer'}
          </h2>
          <div className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800">
            {booking.serviceName}
          </div>
        </div>
        
        <div className="space-y-3 mb-6">
          <p className="text-gray-600 text-sm">
            <span className="font-medium">Date:</span> {booking.startDate}
          </p>
          <p className="text-gray-600 text-sm">
            <span className="font-medium">Time:</span> {booking.startTime} - {booking.endTime}
          </p>
          <p className="text-gray-600 text-sm">
            <span className="font-medium">Duration:</span> {booking.duration} hour(s)
          </p>
          <div className="flex items-center mt-2">
            <span className="font-medium text-sm text-gray-600">Price:</span>
            <span className="ml-2 text-lg font-semibold text-gray-900">₹{booking.totalPrice}</span>
          </div>
        </div>

        {booking.status === 'payment pending' && (
          <button
            onClick={() => handlePayment(booking)}
            disabled={paymentLoadingId=== booking._id}
            className="w-full bg-gray-900 text-white px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {paymentLoadingId === booking._id ? 'Processing...' : 'Proceed to Payment'}
          </button>
        )}

        {booking.status === 'approval required' && (
          <div className="flex items-center space-x-2 text-yellow-700 bg-yellow-50 px-4 py-3 rounded-lg border border-yellow-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium">Awaiting photographer's confirmation</p>
          </div>
        )}

        {booking.status === 'booked' && (
          <div className="flex items-center space-x-2 text-green-700 bg-green-50 px-4 py-3 rounded-lg border border-green-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm font-medium">Booking confirmed</p>
          </div>
        )}

        {booking.status === 'rejected' && (
          <div className="flex items-center space-x-2 text-red-700 bg-red-50 px-4 py-3 rounded-lg border border-red-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <p className="text-sm font-medium">Booking request declined</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar3 />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">My Bookings</h1>

        <div className="mb-8">
  <div className="flex items-center justify-start md:justify-center space-x-4 bg-gray-100 p-1.5 rounded-full overflow-x-auto whitespace-nowrap scrollbar-hide">
    {TABS.map((tab) => {
      
      const tabCounts = {
        all: bookings.length,
        approval: bookings.filter(b => b.status === 'approval required').length,
        payment: bookings.filter(b => b.status === 'payment pending').length,
        confirmed: bookings.filter(b => b.status === 'booked').length,
        rejected: bookings.filter(b => b.status === 'rejected').length
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
          {filteredBookings.map((booking) => (
            <BookingCard key={booking._id} booking={booking} />
          ))}
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No bookings found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}