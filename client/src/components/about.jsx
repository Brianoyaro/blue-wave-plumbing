import React from 'react';

function About() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <h1 className="text-4xl font-bold text-gray-800 mb-6">About Us</h1>

      {/* Intro Paragraph */}
      <p className="text-lg text-gray-600 mb-10 leading-relaxed">
        Welcome to <span className="font-semibold text-blue-600">Bluewave Plumbers</span>, your trusted partner in providing high-quality plumbing materials across Nairobi. We specialize in PPR pipes & fittings, GI pipes & fittings, HDPE pipes & fittings, gutters & accessories, toilets & accessories, general plumbing items, and waste pipes & fittings. Our commitment is to offer reliable, affordable, and durable solutions for every plumbing project.
      </p>

      {/* Mission & Values */}
      <div className="grid md:grid-cols-2 gap-10 mb-12">
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            At Bluewave Plumbers, our mission is simple: to make quality plumbing materials accessible and affordable. We aim to be the go-to supplier for homeowners, contractors, and businesses in Nairobi who value both quality and cost-effectiveness in plumbing solutions.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">Our Values</h2>
          <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-2">
            <li><strong>Customer-Centric:</strong> We prioritize your needs and satisfaction.</li>
            <li><strong>Affordability:</strong> Quality products at pocket-friendly prices.</li>
            <li><strong>Integrity:</strong> We deliver exactly what we promise.</li>
            <li><strong>Community Focused:</strong> Serving Rongain, Nairobi and its neighborhoods with pride.</li>
          </ul>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-blue-50 p-8 rounded-2xl shadow">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Why Choose Bluewave Plumbers?</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          We understand that every project matters. That’s why we ensure our customers 
          receive top-quality products, timely service, and unbeatable value for their money. 
          Whether you’re renovating your home, building from the ground up, or sourcing 
          materials for commercial projects, Bluewave Plumbers has you covered.
        </p>
        <p className="text-gray-600 leading-relaxed">
          With us, you don’t just buy materials—you invest in durability, reliability, 
          and the peace of mind that your project will stand the test of time.
        </p>
      </div>
    </div>
  );
}

export default About;
