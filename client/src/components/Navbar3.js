import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { getUsername } from '../helper/helper';

export default function Navbar3() {
  const navigate = useNavigate();
  const { id } = getUsername();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function userLogout() {
    localStorage.removeItem('token');
    setMobileMenuOpen(false);
    navigate('/');
  }

  return (
    <nav className="bg-black shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/CHome" className="flex items-center">
              <span className="text-2xl font-bold text-white hover:text-gray-300 transition-colors">
                SnapSync
              </span>
            </Link>
          </div>

          <div className="hidden sm:flex sm:items-center sm:space-x-8">


            <Link
              to="/Cards"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Explore
            </Link>
            <Link
              to={`/bookings/${id}`}
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              My Bookings
            </Link>
            <Link
              to="/CHome"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Profile
            </Link>
            <button
              onClick={userLogout}
              className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>

          <div className="sm:hidden">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu, show/hide based on menu state. */}
      {mobileMenuOpen && (
        <div className="sm:hidden px-2 pt-2 pb-3 space-y-1 bg-black">
          <Link
            to="/Cards"
            className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Explore
          </Link>
          <Link
            to={`/bookings/${id}`}
            className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            My Bookings
          </Link>
          <Link
            to="/CHome"
            className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Profile
          </Link>
          <button
            onClick={userLogout}
            className="w-full text-left bg-white text-black hover:bg-gray-200 px-3 py-2 rounded-md text-base font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}