import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Desc.css';
import { loadStripe } from '@stripe/stripe-js/pure';
import Navbar3 from './Navbar3';

import { X, Share, Heart } from 'lucide-react';
import { getUsername } from '../helper/helper';

function Desc() {
  const { id } = useParams();
  const { id: userid } = getUsername();
  const [profile, setProfile] = useState({});
  const [selectedService, setSelectedService] = useState({ price: null, name: null });
  // const [startDate, setStartDate] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState(null);
  // const [daterror, setDaterror] = useState(false); // Track date errors
  
  const [startDate, setStartDate] = useState('');
const [dateError, setDateError] = useState('');


  const [showAllPhotos, setShowAllPhotos] = useState(false);

  const [selectedServiceIndex, setSelectedServiceIndex] = useState(null); //highlight selected service
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

 // Date change handler
const handleDateChange = (e) => {
  const inputValue = e.target.value;
  
  // Check if input is empty
  if (!inputValue) {
    setDateError('');
    setStartDate('');
    return;
  }

  const selected = new Date(inputValue);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectedDate = new Date(selected);
  selectedDate.setHours(0, 0, 0, 0);

  // Check if the selected date is valid
  if (isNaN(selectedDate.getTime())) {
    setDateError("Please enter a valid date.");
    setStartDate('');
    return;
  }

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // Last day of current month
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const isLastDayOfMonth = today.getDate() === lastDayOfMonth.getDate();

  const isSameMonth = selectedDate.getMonth() === today.getMonth();
  const isSameYear = selectedDate.getFullYear() === today.getFullYear();

  // Check if selected date is before tomorrow (includes today and past dates)
  if (selectedDate < tomorrow) {
    setDateError("Booking is only allowed from tomorrow onwards.");
    setStartDate('');
    return;
  }

  // Check if it's the same month and year
  if (isSameMonth && isSameYear) {
    // Valid selection - same month, from tomorrow onwards
    setDateError('');
    setStartDate(inputValue);
    return;
  }

  // Check if it's the first day of next month and today is the last day of current month
  const isFirstOfNextMonth = selectedDate.getDate() === 1 && 
                            selectedDate.getMonth() === today.getMonth() + 1 && 
                            selectedDate.getFullYear() === today.getFullYear();
  
  // Special case for December to January transition
  const isFirstOfNextYear = selectedDate.getDate() === 1 && 
                           selectedDate.getMonth() === 0 && 
                           selectedDate.getFullYear() === today.getFullYear() + 1 &&
                           today.getMonth() === 11; // December

  if (isLastDayOfMonth && (isFirstOfNextMonth || isFirstOfNextYear)) {
    // Valid selection - first day of next month when today is last day of current month
    setDateError('');
    setStartDate(inputValue);
    return;
  }

  // Invalid selection
  if (isLastDayOfMonth) {
    setDateError("You can only book for this month or the 1st of next month (since today is the last day of the month).");
  } else {
    setDateError("You can only book for dates within this month.");
  }
  setStartDate('');
};

// Set min to tomorrow always
const getMinDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

// Set max date based on current date
const getMaxDate = () => {
  const today = new Date();
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0); // last day of current month
  
  // If today is the last day of the month, allow booking for the 1st of next month
  if (today.getDate() === lastDay.getDate()) {
    // Special case for December - allow January 1st of next year
    if (today.getMonth() === 11) {
      return new Date(today.getFullYear() + 1, 0, 1).toISOString().split('T')[0];
    }
    // Allow 1st of next month
    return new Date(today.getFullYear(), today.getMonth() + 1, 1).toISOString().split('T')[0];
  }
  
  // Otherwise, only allow dates within the current month
  return lastDay.toISOString().split('T')[0];
};

const minDate = getMinDate();
const maxDate = getMaxDate();
  useEffect(() => {
    axios.get(`${API_BASE_URL}/desc/${id}`)
      .then((response) => {
        setProfile(response.data);
      })
      .catch((error) => {
        console.error('Error fetching profile description:', error);
      });
  }, [id]);
  const durationOptions = [
    { value: 0.5, label: '30 minutes' },
    { value: 1, label: '1 hour' },
    { value: 1.5, label: '1.5 hours' },
    { value: 2, label: '2 hours' },
    { value: 2.5, label: '2.5 hours' },
    { value: 3, label: '3 hours' },
    { value: 3.5, label: '3.5 hours' },
    { value: 4, label: '4 hours' },
    { value: 4.5, label: '4.5 hours' },
    { value: 5, label: '5 hours' },
    { value: 5.5, label: '5.5 hours' },
    { value: 6, label: '6 hours' },
    { value: 6.5, label: '6.5 hours' },
    { value: 7, label: '7 hours' },
    { value: 7.5, label: '7.5 hours' },
    { value: 8, label: '8 hours' }
  ];
  useEffect(() => {
    if (startTime && duration) {
      const [hours, minutes] = startTime.split(':').map(Number);
      const durationHours = parseFloat(duration);
      
      let totalMinutes = hours * 60 + minutes + durationHours * 60;
      const newHours = Math.floor(totalMinutes / 60);
      const newMinutes = Math.floor(totalMinutes % 60);
      
      const formattedEndTime = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
      setEndTime(formattedEndTime);
    }
  }, [startTime, duration]);
  useEffect(() => {
    if (startDate && startTime && endTime && selectedService.price) {
      calculatePrice(startDate, startTime, endTime, selectedService.price);
    } else {
      setPrice(null);
    }
  }, [startDate, startTime, endTime, selectedService]);

  const handleServiceChange = (service, index) => {
    setSelectedService({
      price: service.pricePerDay,
      name: service.name,
    });
    setSelectedServiceIndex(index); // Track the index of the selected service
  };
  const createBooking = async () => {
    if (!selectedService.price || !startDate || !startTime || !duration) {
      alert('Please fill out all the required fields.');
      return;
    }
  
    const body = {
      userId: userid,
      photographerId: profile.owner,
      serviceName: selectedService.name,
      totalPrice: price,
      startDate,
      startTime,
      endTime,
      duration: parseFloat(duration)
    };
  
    try {
      const response = await axios.post(`${API_BASE_URL}/create-booking`, body);
      if (response.status === 201) {
        alert('Booking created successfully!');
      } else {
        alert('Failed to create booking.');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('An error occurred while creating the booking.');
    }
  };
  
  const calculatePrice = (date, startTime, endTime, servicePrice) => {
    if (!startTime || !endTime || !servicePrice) {
      setPrice(null);
      return;
    }
    

    const totalPrice = Math.round(servicePrice * parseFloat(duration));
    setPrice(totalPrice);
  };
  

  // const today = new Date();
  // const tomorrow = new Date(today);
  // tomorrow.setDate(today.getDate() + 1); // Set tomorrow's date

  // Format the date in YYYY-MM-DD format (HTML input date format)
  // const tomorrowFormatted = tomorrow.toISOString().split('T')[0];

  // Ensure that end date is greater than or equal to the start date
  

 
  const makePayment = async () => {
    if (!selectedService.price || !startDate || !startTime || !endTime) {
      return;
    }
    // sk_test_51QT7hwGpE8twtI882ddG9nzDcVHHf8cVvvjWKiDW53ISmR5pxpMFqOYwu2wMZTMq6RS4ts9cQ8KKrdeguBT8KdUO00k2I475ok //new key
    // pk_test_51O2C7vSFVwLZwqIq2Oa6NgFam2ExFHV3E2ddASYhHDXF41Bl6zHj8WPZNadlfvZXE7QDsTZXq82dw8gdHIKn7Fj400exUj9oJS // old key
    const stripe = await loadStripe("sk_test_51QT7hwGpE8twtI882ddG9nzDcVHHf8cVvvjWKiDW53ISmR5pxpMFqOYwu2wMZTMq6RS4ts9cQ8KKrdeguBT8KdUO00k2I475ok"); 
    const servicename = selectedService.name;
    const serviceprice = selectedService.price;
    const ownerId = profile.owner;

    const body = {
      products: {
        id,
        servicename: selectedService.name,
        serviceprice: selectedService.price,
        price,
        ownerId: profile.owner,
        userid,
        startDate,
        startTime,
        endTime
      },
    };
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      const response = await fetch(`${API_BASE_URL}/api/create-checkout-session`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const session = await response.json();
      await stripe.redirectToCheckout({
        sessionId: session.id,
      });
    } catch (error) {
      console.error("Payment error:", error);
    }
  };
  const PhotoGalleryModal = () => (
    <div className="fixed inset-0 z-50 bg-black/95 overflow-y-auto">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6 text-white">
          <button 
            onClick={() => setShowAllPhotos(false)} 
            className="hover:bg-gray-700 p-2 rounded-full transition"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-4">
            <button className="hover:bg-gray-700 p-2 rounded-full transition">
              <Heart className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {profile.photos?.map((photo, index) => (
            <div 
              key={index} 
              className="aspect-[4/3] overflow-hidden rounded-lg"
            >
              <img 
                src={`${API_BASE_URL}/${photo}`} 
                alt={`Photo ${index + 1}`} 
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  return (
  <div>
    <Navbar3 />
    <div className="max-w-6xl mx-auto px-4 py-8">
      {showAllPhotos && <PhotoGalleryModal />}
      
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">{profile.title}</h1>
        <div className="flex items-center space-x-4">
          <button className="hover:bg-gray-100 p-2 rounded-full transition">
            <Heart className="w-6 h-6" />
          </button>
        </div>
      </div>

      <p className="text-gray-600 mb-4">{profile.city}</p>

      {/* Photo Grid */}
      <div className="grid grid-cols-4 gap-2 h-[460px] rounded-2xl overflow-hidden mb-8">
        {profile.photos?.[0] && (
          <div className="col-span-2 row-span-2">
            <img
              onClick={() => setShowAllPhotos(true)}
              src={`${API_BASE_URL}/${profile.photos[0]}`}
              alt="Main Photo"
              className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition"
            />
          </div>
        )}
        {profile.photos?.slice(1, 5).map((photo, index) => (
          <div key={index} className="col-span-1">
            <img
              onClick={() => setShowAllPhotos(true)}
              src={`${API_BASE_URL}/${photo}`}
              alt={`Photo ${index + 2}`}
              className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition"
            />
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-[2fr_1fr] gap-12">
        {/* Left Column */}
        <div>
          <div className="border-b pb-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">About this Photographer</h2>
            <p className="text-gray-700">{profile.description}</p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-2xl font-semibold mb-6">Services</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {profile.services?.map((service, index) => (
                <div
                  key={index}
                  onClick={() => handleServiceChange(service, index)}
                  className={`relative border rounded-xl p-5 transition cursor-pointer ${
                    selectedService.name === service.name
                      ? "border-black shadow-lg"
                      : "border-gray-300"
                  }`}
                >
                  {selectedService.name === service.name && (
                    <div className="absolute top-3 right-3 w-6 h-6 border-2 border-black rounded-full flex items-center justify-center bg-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-black"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  <div className="mb-4">
                    <h4 className="text-xl font-medium">{service.name}</h4>
                  </div>
                  <div className="text-2xl font-bold">
                    ₹{service.pricePerDay}
                    <span className="text-sm text-gray-500 ml-1">/hour</span>
                  </div>
                  <ul className="text-sm text-gray-600 mt-3 space-y-1">
                    <li>• HD photos & videos</li>
                    <li>• 24/7 availability</li>
                    <li>• Professional editing</li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="sticky top-8">
          <div className="border rounded-xl shadow-lg p-6">
            <div className="mb-6">
              {selectedService.price ? (
                <span className="text-2xl font-bold text-black">
                  ₹{price || selectedService.price}
                </span>
              ) : (
                <span className="text-md font-medium text-gray-500">
                  Select a service and valid dates to see the price
                </span>
              )}
              {selectedService.name && (
                <div className="text-sm text-gray-600 mt-1">{selectedService.name}</div>
              )}
            </div>

            {/* Inputs stacked vertically */}
            <div className="border rounded-xl p-4">
              <div className="flex flex-col space-y-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">DATE</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={handleDateChange}
                    min={minDate}
                    max={maxDate}
                    required
                    aria-label="Select booking date"
                    className="w-full text-sm border rounded p-2"
                  />
                  {dateError && <p className="text-red-500 text-sm mt-1">{dateError}</p>}

                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">START TIME</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full text-sm border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">DURATION</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full text-sm border rounded p-2"
                  >
                    <option value="">Select duration</option>
                    {durationOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={createBooking}
              className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg mt-4 hover:bg-gray-800 transition-colors duration-200"
            >
              Book this Photographer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
export default Desc;  
