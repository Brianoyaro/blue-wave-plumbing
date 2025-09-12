import React, { useState } from "react";
import axios from "axios";

const UploadForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    images: []
  });

  const [previewImages, setPreviewImages] = useState([]);
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });

    // Preview
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
      const response = await axios.post(`${backendURL}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Item uploaded successfully!");
      setFormData({
        name: "",
        description: "",
        category: "",
        images: []
      });
      setPreviewImages([]);
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage = error.response?.data?.error || error.message || "Failed to upload item";
      alert(`Failed to upload item: ${errorMessage}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
          Upload New Item
        </h2>

        {/* Item Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Item Name
          </label>
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
          <label className="block text-gray-700 font-medium mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="3"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          ></textarea>
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="">-- Select Category --</option>
            <option value="PPR pipes & PPR fittings">PPR pipes & PPR fittings</option>
            <option value="gutters & accessories">gutters & accessories</option>
            <option value="GI pipes & GI fittings">GI pipes & GI fittings</option>
            <option value="Toilet & Accessories">Toilet & Accessories</option>
            <option value="General Items">General Items</option>
            <option value="Waste pipes & Fittings">Waste pipes & Fittings</option>
          </select>
        </div>

        {/* Upload Images */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Upload Images
          </label>
          <input
            type="file"
            name="images"
            multiple
            required
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
          Upload Item
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
