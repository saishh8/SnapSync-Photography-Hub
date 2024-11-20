import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Desc.css';
import { loadStripe } from '@stripe/stripe-js/pure';
import Navbar3 from './Navbar3';

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

  const handleServiceChange = (event, service, index) => {
    setSelectedService({
      price: event.target.value,
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

    const stripe = await loadStripe("pk_test_51O2C7vSFVwLZwqIq2Oa6NgFam2ExFHV3E2ddASYhHDXF41Bl6zHj8WPZNadlfvZXE7QDsTZXq82dw8gdHIKn7Fj400exUj9oJS");
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

  return (
    <div><Navbar3 />
      <div className="desc-container mt-4 mx-4">
        <div className="mt-4 bg-gray-100 -mx-8 px-8 pt-8">
          <h1 className="text-3xl font-bold">{profile.title}</h1>
          <p className='block font-semibold'>{profile.city}</p>

          {/* Photo display logic */}
          {showAllPhotos ? (
            <div className="absolute inset-0 bg-black text-white min-h-screen">
              <div className="bg-black p-8 grid gap-4">
                <div>
                  <h2 className="text-3xl mr-48">Photos of {profile.title}</h2>
                  <button
                    onClick={() => setShowAllPhotos(false)}
                    className="fixed right-12 top-8 flex gap-1 py-2 px-4 rounded-2xl shadow shadow-black bg-white text-black"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path
                        fillRule="evenodd"
                        d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Close photos
                  </button>
                </div>
                {profile?.photos?.length > 0 && profile.photos.map((photo, index) => (
                  <div key={index}>
                    <img src={`http://localhost:4000/${photo}`} alt={`Photo ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="grid gap-2 grid-cols-[2fr_1fr] rounded-3xl overflow-hidden">
                <div>
                  {profile.photos?.[0] && (
                    <div>
                      <img
                        onClick={() => setShowAllPhotos(true)}
                        className="aspect-square cursor-pointer object-cover"
                        src={`http://localhost:4000/${profile.photos[0]}`}
                        alt="Main Photo"
                      />
                    </div>
                  )}
                </div>
                <div className="grid">
                  {profile.photos?.[1] && (
                    <img
                      onClick={() => setShowAllPhotos(true)}
                      className="aspect-square cursor-pointer object-cover"
                      src={`http://localhost:4000/${profile.photos[1]}`}
                      alt="Photo 2"
                    />
                  )}
                  <div className="overflow-hidden">
                    {profile.photos?.[2] && (
                      <img
                        onClick={() => setShowAllPhotos(true)}
                        className="aspect-square cursor-pointer object-cover relative top-2"
                        src={`http://localhost:4000/${profile.photos[2]}`}
                        alt="Photo 3"
                      />
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowAllPhotos(true)}
                className="flex gap-1 absolute bottom-2 right-2 py-2 px-4 bg-white rounded-2xl shadow shadow-md shadow-gray-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path
                    fillRule="evenodd"
                    d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 013 6V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-2.69 2.69a1.5 1.5 0 01-2.12 0l-2.69-2.69a1.5 1.5 0 00-2.12 0L3 16.06zm9.47-3.53L12 12a2.25 2.25 0 013.75-1.5L15.75 9.75l2.69 2.69H9.75z"
                    clipRule="evenodd"
                  />
                </svg>
                Show all photos
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-2">
        {!showAllPhotos && (
          <div>
            <div className="my-4">
              <h2 className="font-semibold text-2xl">Description</h2>
              <p>{profile.description}</p>
            </div>
            <div className="services">
              <h3 className="font-semibold text-2xl">Services:</h3>
              <div className="row">
                {profile.services &&
                  profile.services.map((service, index) => (
                    <div className="col-md-4" key={index}>
                      <div className="card mb-4 box-shadow">
                        <div className="card-header">
                          <h4 className="my-0 font-weight-normal">{service.name}</h4>
                        </div>
                        <div className="card-body">
                          <h1 className="card-title pricing-card-title text-black" style={{ fontSize: '24px' }}>
                            ₹{service.pricePerDay}
                            <small className="text-muted" style={{ fontSize: '16px' }}>/Day</small>
                          </h1>
                          <ul className="list-unstyled mt-3 mb-4" style={{ fontSize: '12px' }}>
                            <li>HD photos & videos</li>
                            <li>Photos available 24x7</li>
                            <li>Email support</li>
                            <li>Help center access</li>
                          </ul>
                          <button
                            type="button"
                            value={service.pricePerDay}
                            className={`btn btn-lg btn-block ${selectedServiceIndex === index ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={(event) => handleServiceChange(event, service, index)}
                          >
                            Select
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
        <div>
          <div className="bg-white shadow p-4 rounded-2xl">
            <div className="text-2xl text-center">
              Price: {selectedService.price ? `₹${price || selectedService.price}` : 'Select a service and valid dates to see the price'}
            </div>
            <div className="border rounded-2xl mt-4">
              <div className="flex">
                <div className="py-3 px-4">
                  <label>Start Date</label>
                  <input
            type="date"
            id="start-date"
            name="start-date"
            value={startDate}
            onChange={handleStartDateChange}
            min={tomorrowFormatted}  // Start date must be at least tomorrow
            style={{ padding: '8px', width: '200px', marginLeft: '10px' }}
          />
                </div>
                <div className="py-3 px-4 border-l">
                  <label>End Date</label>
                  <input
            type="date"
            id="end-date"
            name="end-date"
            value={endDate}
            onChange={handleEndDateChange}
            min={startDate}  // End date must be after or equal to start date
            style={{ padding: '8px', width: '200px', marginLeft: '10px' }}
          />
                </div>
              </div>
            </div>
            {/* {daterror && <div style={{ color: 'red' }}>End date must be after the start date</div>} */}
            <button
              onClick={makePayment}
              className="primary mt-4"
              disabled={!price} //daterror
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
