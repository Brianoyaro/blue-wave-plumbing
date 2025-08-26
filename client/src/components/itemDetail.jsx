import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    axios.get(`${backendURL}/${id}`)
      .then(res => setItem(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!item) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-2">{item.name}</h1>
      <p className="text-gray-500 mb-6">{item.category}</p>

      {/* Image Gallery (Airbnb style grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {item.images?.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`${item.name}-${idx}`}
            className="w-full h-80 object-cover rounded-xl shadow-md"
          />
        ))}
      </div>

      {/* Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left - Description */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-2">About this item</h2>
          <p className="text-gray-600 mb-4">{item.description}</p>
          <p className="text-sm text-gray-500">
            Added on {new Date(item.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Right - Price & Availability */}
        <div className="border rounded-xl p-4 shadow-md">
          <p className="text-2xl font-bold mb-2">KES {item.price}</p>
          <p className="text-gray-600 mb-4">
            {item.piecesAvailable} pieces available
          </p>
          <button className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition">
            Reserve Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;
