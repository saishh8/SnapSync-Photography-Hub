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
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [price, setPrice] = useState(null);
  // const [daterror, setDaterror] = useState(false); // Track date errors
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  const [selectedServiceIndex, setSelectedServiceIndex] = useState(null); //highlight selected service


  useEffect(() => {
    axios.get(`http://localhost:4000/desc/${id}`)
      .then((response) => {
        setProfile(response.data);
      })
      .catch((error) => {
        console.error('Error fetching profile description:', error);
      });
  }, [id]);

  useEffect(() => {
    if (startDate && endDate && selectedService.price) {
      calculatePrice(startDate, endDate, selectedService.price);
    } else {
      setPrice(null); // Hide price when dates are invalid or not selected
    }
  }, [startDate, endDate, selectedService]);

  const handleServiceChange = (service, index) => {
    setSelectedService({
      price: service.pricePerDay,
      name: service.name,
    });
    setSelectedServiceIndex(index); // Track the index of the selected service
  };

  const calculatePrice = (start, end, servicePrice) => {
    const startDateTime = new Date(start).getTime();
    const endDateTime = new Date(end).getTime();
    const timeDifference = endDateTime - startDateTime;
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24)) + 1;
    const totalPrice = servicePrice * daysDifference;
    setPrice(totalPrice);
  };

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1); // Set tomorrow's date

  // Format the date in YYYY-MM-DD format (HTML input date format)
  const tomorrowFormatted = tomorrow.toISOString().split('T')[0];

  // Ensure that end date is greater than or equal to the start date
  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);

    // If the end date is before the new start date, reset the end date
    if (endDate && newStartDate > endDate) {
      setEndDate(newStartDate);
    }
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    if (newEndDate >= startDate) {
      setEndDate(newEndDate);
    } else {
      alert('End date cannot be before the start date.');
    }
  };

  const makePayment = async () => {
    if (!selectedService.price || !startDate || !endDate) {
      return;
    }
    // sk_test_51QT7hwGpE8twtI882ddG9nzDcVHHf8cVvvjWKiDW53ISmR5pxpMFqOYwu2wMZTMq6RS4ts9cQ8KKrdeguBT8KdUO00k2I475ok //new key
    // pk_test_51O2C7vSFVwLZwqIq2Oa6NgFam2ExFHV3E2ddASYhHDXF41Bl6zHj8WPZNadlfvZXE7QDsTZXq82dw8gdHIKn7Fj400exUj9oJS // old key
    const stripe = await loadStripe("sk_test_51QT7hwGpE8twtI882ddG9nzDcVHHf8cVvvjWKiDW53ISmR5pxpMFqOYwu2wMZTMq6RS4ts9cQ8KKrdeguBT8KdUO00k2I475ok"); 
    const servicename = selectedService.name;
    const serviceprice = selectedService.price;
    const ownerId = profile.owner;

    const body = {
      products: { id, servicename, serviceprice, price, ownerId, userid, startDate, endDate },
    };
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      const response = await fetch("http://localhost:4000/api/create-checkout-session", {
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
                src={`http://localhost:4000/${photo}`} 
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
    <div >
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
                src={`http://localhost:4000/${profile.photos[0]}`}
                alt="Main Photo"
                className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition"
              />
            </div>
          )}
          {profile.photos?.slice(1, 5).map((photo, index) => (
            <div key={index} className="col-span-1">
              <img
                onClick={() => setShowAllPhotos(true)}
                src={`http://localhost:4000/${photo}`}
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
                    {/* Tick Mark */}
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
                      <span className="text-sm text-gray-500 ml-1">/day</span>
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
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-2xl font-bold">
                
                {selectedService.price ? (
      <span className="text-2xl font-bold text-black">
        ₹{price || selectedService.price}
      </span>
    ) : (
      <span className="text-xl font-semibold text-gray-500 py-2 rounded-md">
      Select a service and valid dates to see the price
      </span>
    )}
                  </span>
              </div>
              {selectedService.name && (
                <span className="text-sm text-gray-600">
                  {selectedService.name}
                </span>
              )}
              
              </div>
              <div className="border rounded-xl">
              <div className="grid grid-cols-2 divide-x">
                <div className="p-3">
                  <label className="block text-xs text-gray-600 mb-1">START DATE</label>
                    <input
                      type="date"
                      id="start-date"
                      name="start-date"
                      value={startDate}
                      onChange={handleStartDateChange}
                      min={tomorrowFormatted} // Start date must be at least tomorrow
                      className="w-full text-sm"
                    />
                  </div>
                  <div className="p-3">
                  <label className="block text-xs text-gray-600 mb-1">END DATE</label>
                    <input
                      type="date"
                      id="end-date"
                      name="end-date"
                      value={endDate}
                      onChange={handleEndDateChange}
                      min={startDate} // End date must be after or equal to start date
                      className="w-full text-sm"
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={makePayment}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 rounded-xl mt-4 hover:opacity-90 transition disabled:opacity-50"
                disabled={!price} // daterror
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
