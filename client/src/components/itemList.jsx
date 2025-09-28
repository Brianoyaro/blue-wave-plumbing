import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ItemList() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  // Debounced search to reduce API calls
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${backendURL}?search=${debouncedSearch}&limit=6`);
      setCategories(res.data);
    } catch (err) {
      setError("Failed to load items. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [backendURL, debouncedSearch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Memoized category rendering for better performance
  const CategorySection = useMemo(() => {
    return categories.map(cat => (
      <div key={cat.category} className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-blue-900 border-b-2 border-blue-300 pb-2">
          {cat.category}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {cat.items.slice(0, 6).map(item => (
            <Link 
              to={`/items/${item._id}`} 
              key={item._id} 
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={item.images?.[0] || "https://via.placeholder.com/300x200?text=No+Image"} 
                  alt={item.name} 
                  className="w-full h-32 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                  }}
                />
              </div>
            </Link>
          ))}
        </div>
        {cat.items.length > 6 && (
          <div className="mt-4 text-right">
            <Link to={`/category/${cat.category}`} className="text-blue-600 hover:underline font-medium">
              View more in {cat.category}
            </Link>
          </div>
        )}
      </div>
    ));
  }, [categories]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8">
      <div className="max-w-6xl mx-auto p-6">
        {/* Search Bar */}
        <div className="mb-8 flex justify-center">
          <input
            type="text"
            placeholder="Search by name or category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full max-w-md px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">Our Products & Services</h1>
          <p className="text-lg text-blue-700 max-w-2xl mx-auto">
            Discover our comprehensive range of plumbing solutions
          </p>
        </div>
        {categories.map(cat => (
          <div key={cat.category} className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-blue-900 border-b-2 border-blue-300 pb-2">
              {cat.category}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {cat.items.slice(0, 6).map(item => (
                <Link 
                  to={`/items/${item._id}`} 
                  key={item._id} 
                  className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={item.images?.[0] || "https://via.placeholder.com/400x300?text=No+Image"} 
                      alt={item.name} 
                      className="w-full h-32 sm:h-48 md:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-3 sm:p-4 md:p-6">
                    <h3 className="text-sm sm:text-lg md:text-xl font-semibold text-blue-900 group-hover:text-blue-700 transition-colors mb-1 sm:mb-2 line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 mb-2 sm:mb-0 md:block hidden">{item.description}</p>
                    <div className="mt-2 sm:mt-4 flex items-center text-blue-600 font-medium text-xs sm:text-sm">
                      <span>View Details</span>
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {cat.items.length > 6 && (
              <div className="mt-4 text-right">
                <Link to={`/category/${cat.category}`} className="text-blue-600 hover:underline font-medium">
                  View more in {cat.category}
                </Link>
              </div>
            )}
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
