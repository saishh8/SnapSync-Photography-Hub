import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import Navbar3 from './Navbar3';

function Card() {
  const navigate = useNavigate();
  const [profileCards, setProfileCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [uniqueCities, setUniqueCities] = useState([]);

  // Fetch all cards
  useEffect(() => {
    axios.get('http://localhost:4000/allcards')
      .then((response) => {
        setProfileCards(response.data);
        setFilteredCards(response.data);
        
        // Extract unique cities
        const cities = [...new Set(response.data.map(profile => profile.city))];
        setUniqueCities(cities);
      })
      .catch((error) => {
        console.error('Error fetching profile cards:', error);
      });
  }, []);

  // Filter and search function
  useEffect(() => {
    let result = profileCards;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(profile => 
        profile.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply city filter
    if (cityFilter) {
      result = result.filter(profile => profile.city === cityFilter);
    }

    setFilteredCards(result);
  }, [searchTerm, cityFilter, profileCards]);

  const handleCardClick = (id) => {
    navigate(`/desc/${id}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar3 />
      
      <div className="container mx-auto px-4 py-6">
        {/* Search and Filter Container */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
          </div>

          {/* City Filter Dropdown */}
          <div className="relative flex-grow">
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="">All Cities</option>
              {uniqueCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        {/* No Results State */}
        {filteredCards.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-xl">No profiles found</p>
          </div>
        )}

        {/* Profile Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCards.map((profile) => (
            <div
              key={profile._id}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 cursor-pointer overflow-hidden"
              onClick={() => handleCardClick(profile._id)}
            >
              <img
                src={`http://localhost:4000/${profile.photos[0]}`}
                alt="Profile"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 truncate">{profile.title}</h2>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {profile.description}
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {profile.city}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Card;