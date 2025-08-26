import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ItemList() {
  const [items, setItems] = useState([]);
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(backendURL);
        setItems(response.data);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      }
    };
    fetchItems();
  }, []);

  // const fallbackImage = "https://via.placeholder.com/400x300?text=No+Image";
  const fallbackImage = "https://via.placeholder.com/300";

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        Our Products
      </h1>

      {items.length === 0 ? (
        <p className="text-center text-gray-500">No items available.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <Link
              to={`/item/${item._id}`}
              key={item._id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden group"
            >
              {/* Item Image */}
              <div className="w-full h-56 overflow-hidden">
                <img
                  src={item.images?.[0] || fallbackImage}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => (e.currentTarget.src = fallbackImage)}
                />
              </div>

              {/* Item Details */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {item.name}
                </h3>
                <p className="text-gray-500 text-sm mb-2">
                  {item.category}
                </p>
                <p className="text-blue-600 font-bold text-lg">
                  KES {item.price}
                </p>
                <p className="text-gray-400 text-sm">
                  {item.piecesAvailable} pieces available
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default ItemList;
