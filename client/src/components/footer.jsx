import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-10">
      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Company Info */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Bluewave Plumbers</h2>
          <p className="text-blue-100 mb-4 leading-relaxed">
            Bluewave Plumbers is your trusted partner in providing quality plumbing supplies in Rongai, Nairobi and beyond.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-blue-400">Shop</a></li>
            <li><a href="/home" className="hover:text-blue-400">Home</a></li>
            <li><a href="/about" className="hover:text-blue-400">About Us</a></li>
            <li><a href="/contact" className="hover:text-blue-400">Contact Us</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
          <address className="not-italic space-y-2 text-sm">
            <p><span className="font-semibold">Location:</span> Rongai, Kenya</p>
            <p><span className="font-semibold">Phone:</span> <a href="tel:+254797965768" className="hover:text-blue-400">+254797965768</a></p>
            <p><span className="font-semibold">Email:</span> <a href="mailto:bluewaveharsuppliers@gmail.com" className="hover:text-blue-400">bluewaveharsuppliers@gmail.com</a></p>
          </address>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex space-x-4 text-xl">
            <a href="#" className="hover:text-blue-400"><FaFacebookF /></a>
            <a href="#" className="hover:text-blue-400"><FaTwitter /></a>
            <a href="#" className="hover:text-blue-400"><FaInstagram /></a>
            <a href="#" className="hover:text-blue-400"><FaLinkedin /></a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Bluewave Plumbers. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
