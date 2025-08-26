import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ItemUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    piecesAvailable: "",
    images: [],
  });

  const [previewImages, setPreviewImages] = useState([]);
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  // Fetch existing item data
  useEffect(() => {
    axios
      .get(`${backendURL}/${id}`)
      .then((res) => {
        const item = res.data;
        setFormData({
          name: item.name || "",
          description: item.description || "",
          price: item.price || "",
          category: item.category || "",
          piecesAvailable: item.piecesAvailable || "",
          images: [], // We'll handle new uploads separately
        });
        setPreviewImages(item.images || []);
      })
      .catch((err) => console.error(err));
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });

    // Preview new images
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "images") {
        formData.images.forEach((file) => data.append("images", file));
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      await axios.put(`${backendURL}/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Item updated successfully!");
      navigate("/"); // redirect after update
    } catch (error) {
      console.error(error);
      alert("Failed to update item");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
          Update Item
        </h2>

        {/* Item Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Item Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          ></textarea>
        </div>

        {/* Price */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Price (KES)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="">-- Select Category --</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Masonry">Masonry</option>
            <option value="Electrical">Electrical</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Pieces Available */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Pieces Available</label>
          <input
            type="number"
            name="piecesAvailable"
            value={formData.piecesAvailable}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Upload Images */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Upload New Images</label>
          <input
            type="file"
            name="images"
            multiple
            onChange={handleFileChange}
            className="w-full"
          />
          <div className="flex gap-3 mt-3 flex-wrap">
            {previewImages.map((src, index) => (
              <img
                key={index}
                src={src}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg border"
              />
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          Update Item
        </button>
      </form>
    </div>
  );
};

export default ItemUpdate;
