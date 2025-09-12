import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // icons for mobile toggle
import BlueWaveLogo from "./BlueWaveLogo";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-800 to-blue-700 shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        
        {/* Left Logo */}
        <Link to="/" className="hover:opacity-90 transition-opacity">
          <BlueWaveLogo showText={true} />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          <Link to="/home" className="text-blue-100 hover:text-white transition-colors font-medium">
            Home
          </Link>
          <Link to="/about" className="text-blue-100 hover:text-white transition-colors font-medium">
            About Us
          </Link>
          <Link to="/contact" className="text-blue-100 hover:text-white transition-colors font-medium">
            Contact Us
          </Link>
          <Link to="/" className="text-blue-100 hover:text-white transition-colors font-medium">
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
        <div className="md:hidden px-6 pb-4 space-y-3 bg-blue-800">
          <Link 
            to="/home" 
            className="block text-blue-100 hover:text-white transition-colors font-medium py-2"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className="block text-blue-100 hover:text-white transition-colors font-medium py-2"
            onClick={() => setIsOpen(false)}
          >
            About Us
          </Link>
          <Link 
            to="/contact" 
            className="block text-blue-100 hover:text-white transition-colors font-medium py-2"
            onClick={() => setIsOpen(false)}
          >
            Contact Us
          </Link>
          <Link 
            to="/" 
            className="block text-blue-100 hover:text-white transition-colors font-medium py-2"
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
