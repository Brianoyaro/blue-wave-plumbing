import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // icons for mobile toggle
import BluewaveLogo from "./BluewaveLogo";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-blue-800 shadow-xl sticky top-0 z-40 border-b-2 border-blue-600">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Left Logo - Enhanced visibility */}
        <Link to="/" className="hover:opacity-95 transition-all duration-300 transform hover:scale-105">
          <BluewaveLogo 
            showText={true} 
            textSize="text-2xl" 
            className="h-14 w-auto" 
            textColor="text-white" 
            subTextColor="text-blue-200"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          <Link to="/home" className="text-blue-100 hover:text-white transition-all duration-300 font-semibold text-lg hover:bg-blue-700 px-3 py-2 rounded-lg">
            Home
          </Link>
          <Link to="/about" className="text-blue-100 hover:text-white transition-all duration-300 font-semibold text-lg hover:bg-blue-700 px-3 py-2 rounded-lg">
            About Us
          </Link>
          <Link to="/contact" className="text-blue-100 hover:text-white transition-all duration-300 font-semibold text-lg hover:bg-blue-700 px-3 py-2 rounded-lg">
            Contact Us
          </Link>
          <Link to="/" className="text-blue-100 hover:text-white transition-all duration-300 font-semibold text-lg hover:bg-blue-700 px-3 py-2 rounded-lg">
            Browse Items
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white hover:text-blue-200 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-6 pb-4 space-y-3 bg-blue-900 border-t border-blue-600">
          <Link 
            to="/home" 
            className="block text-blue-100 hover:text-white hover:bg-blue-700 transition-all duration-300 font-semibold py-3 px-3 rounded-lg"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className="block text-blue-100 hover:text-white hover:bg-blue-700 transition-all duration-300 font-semibold py-3 px-3 rounded-lg"
            onClick={() => setIsOpen(false)}
          >
            About Us
          </Link>
          <Link 
            to="/contact" 
            className="block text-blue-100 hover:text-white hover:bg-blue-700 transition-all duration-300 font-semibold py-3 px-3 rounded-lg"
            onClick={() => setIsOpen(false)}
          >
            Contact Us
          </Link>
          <Link 
            to="/" 
            className="block text-blue-100 hover:text-white hover:bg-blue-700 transition-all duration-300 font-semibold py-3 px-3 rounded-lg"
            onClick={() => setIsOpen(false)}
          >
            Shop
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
