import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar3 from './Navbar3';

function Card() {
  const navigate = useNavigate();
  const [profileCards, setProfileCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [uniqueCities, setUniqueCities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [allPhotographers, setAllPhotographers] = useState([]);

  // Fetch all cards with pagination
  const fetchPhotographers = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:4000/allcards?page=${page}&limit=8`);

      // Add proper error handling and fallback values
      const photographers = response.data?.photographers || [];
      const pagination = response.data?.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0
      };

      setProfileCards(photographers);
      setFilteredCards(photographers);
      setCurrentPage(pagination.currentPage);
      setTotalPages(pagination.totalPages);
      setTotalItems(pagination.totalItems);

      // Extract unique cities from all photographers (we'll need to fetch all for filtering)
      if (page === 1) {
        try {
          const allResponse = await axios.get(`http://localhost:4000/allcards?page=1&limit=1000`);
          const allPhotographers = allResponse.data?.photographers || [];
          setAllPhotographers(allPhotographers);
          const cities = [...new Set(allPhotographers.map(profile => profile.city).filter(Boolean))];
          setUniqueCities(cities);
        } catch (allError) {
          console.error('Error fetching all photographers for filtering:', allError);
          setUniqueCities([]);
        }
      }
    } catch (error) {
      console.error('Error fetching profile cards:', error);
      // Set fallback values on error
      setProfileCards([]);
      setFilteredCards([]);
      setCurrentPage(1);
      setTotalPages(1);
      setTotalItems(0);
      setUniqueCities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotographers(currentPage);
  }, [currentPage]);

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
              style={{ paddingLeft: '3rem', paddingRight: '1rem' }}
              className="w-full py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              {uniqueCities && uniqueCities.length > 0 && uniqueCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-500">Loading photographers...</p>
          </div>
        )}

        {/* No Results State */}
        {!loading && filteredCards.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-xl">No profiles found</p>
          </div>
        )}

        {/* Profile Cards Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCards && filteredCards.length > 0 && filteredCards.map((profile) => (
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
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && renderPagination()}

        {/* Results Info */}
        {!loading && (
          <div className="text-center mt-4 text-sm text-gray-500">
            Showing {((currentPage - 1) * 8) + 1} to {Math.min(currentPage * 8, totalItems)} of {totalItems} photographers
          </div>
        )}
      </div>
    </div>
  );
}

export default Card;