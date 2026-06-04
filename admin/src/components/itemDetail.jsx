import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const fallbackImage = "https://via.placeholder.com/400x300?text=No+Image";
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  // Fetch item by ID
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get(`${backendURL}/${id}`);
        console.log(res.data);
        setItem(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchItem();
  }, [id]);

  // Handle delete
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        console.log("🗑️ [DELETE] Starting item deletion...");
        console.log(`🗑️ [DELETE] Item ID: ${id}`);
        await axios.delete(`${backendURL}/${id}`);
        console.log("✅ [DELETE] Item deleted successfully");
        toast.success("Item deleted successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => navigate("/"), 1500);
      } catch (err) {
        console.error("❌ [DELETE] Error:", err);
        console.error("📍 [ERROR] Error type:", err.name);
        console.error("💬 [ERROR] Message:", err.message);
        if (err.response) {
          console.error("🚨 [RESPONSE] Status:", err.response.status);
          console.error("🚨 [RESPONSE] Data:", err.response.data);
        }
        toast.error("❌ Failed to delete item. Please try again.", {
          position: "top-right",
          autoClose: 4000,
        });
      }
    }
  };

  if (!item) return <p className="text-center mt-20 text-gray-500">Loading item...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-5xl mx-auto px-6">
        {/* Back Navigation */}
        <Link 
          to="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Items
        </Link>

        {/* Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6 mb-8">
          {item.images.length > 0 ? (
            item.images.map((img, index) => (
              <div key={index} className="relative group overflow-hidden rounded-2xl shadow-lg bg-gray-50">
                <img
                  src={img || fallbackImage}
                  alt={`${item.name}-${index}`}
                  className="w-full h-48 sm:h-64 md:h-64 object-contain group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => (e.currentTarget.src = fallbackImage)}
                />
              </div>
            ))
          ) : (
            <div className="md:col-span-2">
              <img
                src={fallbackImage}
                alt="placeholder"
                className="w-full h-48 sm:h-64 md:h-64 object-contain rounded-2xl shadow-lg bg-gray-50"
              />
            </div>
          )}
        </div>

        {/* Item Info */}
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <div className="mb-6">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              {item.category}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold text-blue-900 mb-4">{item.name}</h1>
          <p className="text-gray-700 text-lg leading-relaxed mb-8">{item.description}</p>

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <Link
              to={`/item/update/${item._id}`}
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Update Item
            </Link>
            <button
              onClick={handleDelete}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Item
            </button>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Created on {new Date(item.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;
