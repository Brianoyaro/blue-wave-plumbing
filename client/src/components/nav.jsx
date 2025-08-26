import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // icons for mobile toggle

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Left Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Blue-Wave
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          <Link to="/home" className="text-gray-700 hover:text-blue-600 transition">
            Home
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-600 transition">
            About Us
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition">
            Contact Us
          </Link>
          <Link to="/" className="text-gray-700 hover:text-blue-600 transition">
            Shop
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-6 pb-4 space-y-3">
          <Link to="/home" className="block text-gray-700 hover:text-blue-600 transition">
            Home
          </Link>
          <Link to="/about" className="block text-gray-700 hover:text-blue-600 transition">
            About Us
          </Link>
          <Link to="/contact" className="block text-gray-700 hover:text-blue-600 transition">
            Contact Us
          </Link>
          <Link to="/" className="block text-gray-700 hover:text-blue-600 transition">
            Shop
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
