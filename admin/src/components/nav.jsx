import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-blue-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          {/* Logo - Responsive text size */}
          <Link 
            to="/" 
            className="text-lg sm:text-xl md:text-2xl font-bold text-white hover:text-blue-200 transition-colors truncate"
          >
            Bluewave Admin
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex space-x-4 md:space-x-6 items-center">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-200 font-semibold bg-blue-700 px-3 py-2 text-sm md:text-base rounded-lg"
                  : "text-blue-100 hover:text-white hover:bg-blue-700 px-3 py-2 text-sm md:text-base rounded-lg transition-all"
              }
            >
              Manage Items
            </NavLink>

            <NavLink
              to="/upload"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-200 font-semibold bg-blue-700 px-3 py-2 text-sm md:text-base rounded-lg"
                  : "text-blue-100 hover:text-white hover:bg-blue-700 px-3 py-2 text-sm md:text-base rounded-lg transition-all"
              }
            >
              Create Item
            </NavLink>

            <NavLink
             to="/quote"
             className={({ isActive }) =>
                isActive
                  ? "text-blue-200 font-semibold bg-blue-700 px-3 py-2 text-sm md:text-base rounded-lg"
                  : "text-blue-100 hover:text-white hover:bg-blue-700 px-3 py-2 text-sm md:text-base rounded-lg transition-all"
              }
             >
               Create Quote
             </NavLink>
          </div>

          {/* Mobile Hamburger Menu */}
          <button
            onClick={toggleMenu}
            className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-blue-100 hover:text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
          >
            <svg
              className={`h-6 w-6 transition-transform ${isMenuOpen ? "rotate-90" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="sm:hidden mt-3 pb-3 space-y-2 border-t border-blue-700 pt-3">
            <NavLink
              to="/"
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive
                  ? "block text-blue-200 font-semibold bg-blue-700 px-4 py-3 text-base rounded-lg w-full text-left"
                  : "block text-blue-100 hover:text-white hover:bg-blue-700 px-4 py-3 text-base rounded-lg transition-all w-full text-left"
              }
            >
              Manage Items
            </NavLink>

            <NavLink
              to="/upload"
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive
                  ? "block text-blue-200 font-semibold bg-blue-700 px-4 py-3 text-base rounded-lg w-full text-left"
                  : "block text-blue-100 hover:text-white hover:bg-blue-700 px-4 py-3 text-base rounded-lg transition-all w-full text-left"
              }
            >
              Create Item
            </NavLink>

            <NavLink
              to="/quote"
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive
                  ? "block text-blue-200 font-semibold bg-blue-700 px-4 py-3 text-base rounded-lg w-full text-left"
                  : "block text-blue-100 hover:text-white hover:bg-blue-700 px-4 py-3 text-base rounded-lg transition-all w-full text-left"
              }
            >
              Create Quote
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
