import React from 'react';
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="max-w-7xl mx-auto px-6">

      {/* Hero Section */}
      <section className="text-center py-16 md:py-24">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Quality Plumbing & Masonry Materials in Nairobi
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Welcome to <span className="font-semibold text-blue-600">Blue-Wave</span> — 
          your trusted source for durable, pocket-friendly plumbing, masonry, and 
          construction supplies. We make it easy to build with confidence.
        </p>
        <Link
          to="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition"
        >
          Shop Now
        </Link>
      </section>

      {/* Categories Section */}
      <section className="py-12">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-10">
          Explore Our Categories
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="rounded-2xl shadow hover:shadow-lg transition overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1600566752355-35792bedcfea"
              alt="Plumbing"
              className="w-full h-56 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold">Plumbing</h3>
              <p className="text-gray-600">
                Pipes, fittings, fixtures, and accessories built to last.
              </p>
            </div>
          </div>

          <div className="rounded-2xl shadow hover:shadow-lg transition overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1581091870627-3c1c10e8e3be"
              alt="Masonry"
              className="w-full h-56 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold">Masonry</h3>
              <p className="text-gray-600">
                Bricks, cement, blocks, and other strong building essentials.
              </p>
            </div>
          </div>

          <div className="rounded-2xl shadow hover:shadow-lg transition overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1590658006820-5f9b06d98e36"
              alt="Construction Materials"
              className="w-full h-56 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold">Construction</h3>
              <p className="text-gray-600">
                Tools, materials, and everything you need for your projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 text-center bg-blue-50 rounded-2xl my-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          Why Choose Blue-Wave?
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-6 bg-white rounded-xl shadow">
            <h3 className="font-bold text-xl mb-2">Pocket-Friendly</h3>
            <p className="text-gray-600">
              High-quality materials at affordable prices.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow">
            <h3 className="font-bold text-xl mb-2">Trusted in Nairobi</h3>
            <p className="text-gray-600">
              Serving homeowners, contractors & businesses with pride.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow">
            <h3 className="font-bold text-xl mb-2">Quality Guaranteed</h3>
            <p className="text-gray-600">
              Only the best, durable materials for your projects.
            </p>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="text-center py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Ready to Build With Confidence?
        </h2>
        <Link
          to="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition"
        >
          Start Shopping
        </Link>
      </section>
    </div>
  );
}

export default Home;
