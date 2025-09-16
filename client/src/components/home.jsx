import React from 'react';
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="max-w-7xl mx-auto px-6">

      {/* Hero Section */}
      <section className="text-center py-16 md:py-24">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          Bluewave Plumbers - Rongai, Nairobi
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Your trusted source for quality plumbing materials in Rongai, Nairobi. We specialize in <span className="font-semibold text-blue-600">PPR pipes & fittings</span>, <span className="font-semibold text-blue-600">GI pipes & fittings</span>, <span className="font-semibold text-blue-600">gutters & accessories</span>, <span className="font-semibold text-blue-600">toilets & accessories</span>, and all plumbing supplies. Quality products at pocket-friendly prices!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="bg-blue-600 text-white px-8 py-3 rounded-xl shadow hover:bg-blue-700 transition font-semibold"
          >
            Browse Our Products
          </Link>
          <Link
            to="/contact"
            className="bg-white border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-xl shadow hover:bg-blue-50 transition font-semibold"
          >
            Get Quote
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-10">
          Our Plumbing Materials Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden bg-white">
            <img src="/bluewaves/ppr.jpeg" alt="PPR pipes & fittings" className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-blue-900 mb-2">PPR Pipes & Fittings</h3>
              <p className="text-gray-600">High-quality PPR pipes and fittings for reliable plumbing installations in Kenya.</p>
            </div>
          </div>
          
          <div className="rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden bg-white">
            <img src="/bluewaves/gi.jpeg" alt="GI pipes & fittings" className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-blue-900 mb-2">GI Pipes & Fittings</h3>
              <p className="text-gray-600">Galvanized iron pipes and fittings for durable and long-lasting plumbing solutions.</p>
            </div>
          </div>
          
          <div className="rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden bg-white">
            <img src="/bluewaves/gutter.jpeg" alt="Gutters & accessories" className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-blue-900 mb-2">Gutters & Accessories</h3>
              <p className="text-gray-600">Premium gutters and accessories for effective rainwater management systems.</p>
            </div>
          </div>
          
          <div className="rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden bg-white">
            <img src="/bluewaves/toilet.jpeg" alt="Toilets & Accessories" className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-blue-900 mb-2">Toilets & Accessories</h3>
              <p className="text-gray-600">Modern toilets and bathroom accessories for complete bathroom solutions.</p>
            </div>
          </div>
          
          <div className="rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden bg-white">
            <img src="/bluewaves/waste.jpeg" alt="Waste pipes & Fittings" className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-blue-900 mb-2">Waste Pipes & Fittings</h3>
              <p className="text-gray-600">Reliable waste pipes and drainage fittings for efficient waste management.</p>
            </div>
          </div>
          
          <div className="rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden bg-white">
            <img src="/bluewaves/general.jpeg" alt="General plumbing Items" className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-blue-900 mb-2">General Plumbing Items</h3>
              <p className="text-gray-600">Essential plumbing tools, valves, and accessories for all your plumbing needs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 text-center bg-blue-50 rounded-2xl my-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          Why Choose Bluewave Plumbers?
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-6 bg-white rounded-xl shadow">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="font-bold text-xl mb-2">Affordable Prices</h3>
            <p className="text-gray-600">
              Best quality plumbing materials at pocket-friendly prices in Rongai and Nairobi.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-xl mb-2">Quality Guaranteed</h3>
            <p className="text-gray-600">
              Only genuine, tested plumbing materials from trusted manufacturers.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-xl mb-2">Local Rongai Shop</h3>
            <p className="text-gray-600">
              Conveniently located in Rongai, serving Nairobi and surrounding areas.
            </p>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="text-center py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Ready to Start Your Plumbing Project?
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Get the best plumbing materials in Rongai, Nairobi. Quality products, expert advice, and unbeatable prices.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="bg-blue-600 text-white px-8 py-3 rounded-xl shadow hover:bg-blue-700 transition font-semibold"
          >
            Browse Our Products
          </Link>
          <Link
            to="/contact"
            className="bg-white border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-xl shadow hover:bg-blue-50 transition font-semibold"
          >
            Contact Us Today
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
