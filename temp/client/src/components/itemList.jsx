import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ItemList() {
  const [categories, setCategories] = useState([]);
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    axios.get(`${backendURL}`)
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">Our Products & Services</h1>
          <p className="text-lg text-blue-700 max-w-2xl mx-auto">
            Discover our comprehensive range of plumbing, masonry, and electrical solutions
          </p>
        </div>

        {categories.map(cat => (
          <div key={cat.category} className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-blue-900 border-b-2 border-blue-300 pb-2">
              {cat.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {cat.items.map(item => (
                <Link 
                  to={`/items/${item._id}`} 
                  key={item._id} 
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={item.images?.[0] || "https://via.placeholder.com/400x300?text=No+Image"} 
                      alt={item.name} 
                      className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-blue-900 group-hover:text-blue-700 transition-colors mb-2">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                    <div className="mt-4 flex items-center text-blue-600 font-medium">
                      <span>View Details</span>
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
        
        {categories.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-6m-6 0H4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-2">No Products Available</h3>
              <p className="text-gray-600">Check back soon for our latest products and services.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ItemList;
