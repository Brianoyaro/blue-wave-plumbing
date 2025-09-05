import React from "react";
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-blue-900 to-blue-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-white hover:text-blue-200 transition-colors">
          Bluewave Admin
        </Link>

        {/* Links */}
        <div className="space-x-6 flex items-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-blue-200 font-semibold bg-blue-700 px-3 py-2 rounded-lg"
                : "text-blue-100 hover:text-white hover:bg-blue-700 px-3 py-2 rounded-lg transition-all"
            }
          >
            Manage Items
          </NavLink>

          <NavLink
            to="/upload"
            className={({ isActive }) =>
              isActive
                ? "text-blue-200 font-semibold bg-blue-700 px-3 py-2 rounded-lg"
                : "text-blue-100 hover:text-white hover:bg-blue-700 px-3 py-2 rounded-lg transition-all"
            }
          >
            Create Item
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
