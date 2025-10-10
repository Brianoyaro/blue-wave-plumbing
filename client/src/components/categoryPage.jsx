import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function CategoryPage() {
  const { category } = useParams();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    setLoading(true);
    axios.get(`${backendURL}/category/${encodeURIComponent(category)}?search=${search}&page=${currentPage}`)
      .then(res => {
        setItems(res.data.items);
        setPagination(res.data.pagination);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [category, search, currentPage]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to All Products
          </Link>
          <h1 className="text-4xl font-bold text-blue-900 mb-4">{category}</h1>
          <p className="text-lg text-blue-700">
            Browse all products in the {category} category
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 flex justify-center">
          <input
            type="text"
            placeholder={`Search in ${category}...`}
            value={search}
            onChange={handleSearchChange}
            className="w-full max-w-md px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-blue-700">Loading products...</p>
          </div>
        ) : (
          <>
            {/* Items Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
              {items.map(item => (
                <Link 
                  to={`/items/${item._id}`} 
                  key={item._id} 
                  className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={item.images?.[0] || "https://via.placeholder.com/400x300?text=No+Image"} 
                      alt={item.name} 
                      className="w-full h-32 sm:h-48 md:h-56 object-contain bg-gray-50 group-hover:scale-105 transition-transform duration-300"
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

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition"
                >
                  Previous
                </button>
                <span className="text-blue-900">
                  Page {currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                  disabled={currentPage === pagination.totalPages}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition"
                >
                  Next
                </button>
              </div>
            )}

            {items.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-6m-6 0H4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-blue-900 mb-2">No Products Found</h3>
                  <p className="text-gray-600">No products found in this category{search && ` matching "${search}"`}.</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CategoryPage;
