import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

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
        await axios.delete(`${backendURL}/${id}`);
        alert("Item deleted successfully!");
        navigate("/"); // redirect after delete
      } catch (err) {
        console.error(err);
        alert("Failed to delete item.");
      }
    }
  };

  if (!item) return <p className="text-center mt-20 text-gray-500">Loading item...</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {item.images.length > 0 ? (
          item.images.map((img, index) => (
            <img
              key={index}
              src={img || fallbackImage}
              alt={`${item.name}-${index}`}
              className="w-full h-64 object-cover rounded-2xl shadow"
              onError={(e) => (e.currentTarget.src = fallbackImage)}
            />
          ))
        ) : (
          <img
            src={fallbackImage}
            alt="placeholder"
            className="w-full h-64 object-cover rounded-2xl shadow"
          />
        )}
      </div>

      {/* Item Info */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{item.name}</h1>
        <p className="text-gray-500 mb-4">{item.category}</p>
        <p className="text-gray-700 mb-4">{item.description}</p>
        <p className="text-blue-600 font-bold text-2xl mb-2">KES {item.price}</p>
        <p className="text-gray-400 mb-4">{item.piecesAvailable} pieces available</p>

        {/* Actions */}
        <div className="flex gap-4">
          <Link
            to={`/item/update/${item._id}`}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition"
          >
            Update
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;
