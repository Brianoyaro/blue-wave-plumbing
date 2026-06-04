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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-3 sm:mb-4 transition-colors text-sm sm:text-base group"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Items
          </Link>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 mb-1 sm:mb-2">
            {category}
          </h1>
          <p className="text-sm sm:text-base text-blue-700">
            Manage all items in this category
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 sm:mb-8 flex justify-center">
          <input
            type="text"
            placeholder={`Search in ${category}...`}
            value={search}
            onChange={handleSearchChange}
            className="w-full max-w-2xl px-4 py-3 sm:py-4 text-base sm:text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 sm:py-16">
            <div className="text-center">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 mx-auto mb-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <p className="text-blue-700 text-sm sm:text-base">Loading items...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Items Grid */}
            {items.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12">
                {items.map(item => (
                  <Link 
                    to={`/item/${item._id}`} 
                    key={item._id} 
                    className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
                  >
                    {/* Image Section */}
                    <div className="relative overflow-hidden bg-gray-50 flex-shrink-0">
                      <img 
                        src={item.images?.[0] || "https://via.placeholder.com/400x300?text=No+Image"} 
                        alt={item.name} 
                        className="w-full h-24 sm:h-40 md:h-48 lg:h-56 object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 sm:px-3 py-1 rounded-full line-clamp-1">
                          {category.length > 15 ? category.substring(0, 12) + '...' : category}
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-2 sm:p-3 md:p-4 flex-grow flex flex-col">
                      <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-blue-900 group-hover:text-blue-700 transition-colors mb-1 line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-xs md:text-sm line-clamp-2 mb-2 flex-grow">
                        {item.description}
                      </p>

                      {/* Action Footer */}
                      <div className="flex items-center text-blue-600 font-medium text-xs sm:text-sm group-hover:text-blue-800 transition-colors mt-auto pt-2 border-t border-gray-100">
                        <span className="flex-grow">Manage</span>
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 group-hover:translate-x-1 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mb-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition text-sm sm:text-base flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>

                <span className="text-blue-900 font-semibold text-sm sm:text-base whitespace-nowrap">
                  Page <span className="font-bold">{currentPage}</span> of <span className="font-bold">{pagination.totalPages}</span>
                </span>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                  disabled={currentPage === pagination.totalPages}
                  className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition text-sm sm:text-base flex items-center justify-center"
                >
                  Next
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}

            {/* Empty State */}
            {items.length === 0 && !loading && (
              <div className="flex items-center justify-center py-12 sm:py-16 md:py-20">
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-12 max-w-md w-full mx-auto text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-6m-6 0H4" />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-bold text-blue-900 mb-2 sm:mb-3">
                    No Items Found
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
                    No items found in this category{search && ` matching "${search}"`}.
                  </p>
                  <Link 
                    to="/upload" 
                    className="inline-flex items-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all transform hover:scale-105 text-sm sm:text-base"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create New Item
                  </Link>
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
