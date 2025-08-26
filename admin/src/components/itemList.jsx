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
    <div className="max-w-6xl mx-auto p-6">
      {categories.map(cat => (
        <div key={cat.category} className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{cat.category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {cat.items.map(item => (
              <Link 
                to={`/item/${item._id}`} 
                key={item._id} 
                className="block rounded-2xl overflow-hidden shadow hover:shadow-lg transition"
              >
                <img 
                  src={item.images?.[0] || "https://via.placeholder.com/300"} 
                  alt={item.name} 
                  className="w-full h-60 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-500">{item.price} KES</p>
                  <p className="text-sm text-gray-400">{item.piecesAvailable} available</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ItemList;
