import React, { useState } from "react";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { toast } from "react-toastify";

const UploadForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    images: []
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Compress images before upload
  const compressImages = async (files) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    };

    console.log("🔧 [COMPRESSION] Starting image compression...");
    console.log(`📦 [COMPRESSION] Input: ${files.length} files, ${(files.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024).toFixed(2)}MB total`);

    const compressedFiles = [];
    for (let file of files) {
      try {
        const originalSize = file.size / 1024 / 1024;
        const compressed = await imageCompression(file, options);
        const compressedSize = compressed.size / 1024 / 1024;
        const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(1);
        
        compressedFiles.push(compressed);
        console.log(`✅ [COMPRESSION] ${file.name}: ${originalSize.toFixed(2)}MB → ${compressedSize.toFixed(2)}MB (${ratio}% reduction)`);
      } catch (error) {
        console.error(`❌ [COMPRESSION] Failed to compress ${file.name}:`, error);
        compressedFiles.push(file); // fallback to original
      }
    }
    
    const totalCompressed = compressedFiles.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024;
    console.log(`✨ [COMPRESSION] Complete! Output: ${compressedFiles.length} files, ${totalCompressed.toFixed(2)}MB total`);
    return compressedFiles;
  };

  // Handle file input
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    console.log(`📂 [FILE SELECT] ${files.length} file(s) selected`);
    console.log(`📊 [FILE SELECT] Total size: ${(files.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024).toFixed(2)}MB`);
    files.forEach(f => console.log(`  - ${f.name}: ${(f.size / 1024 / 1024).toFixed(2)}MB (${f.type})`));
    
    setIsCompressing(true);

    try {
      const compressedFiles = await compressImages(files);
      setFormData({ ...formData, images: compressedFiles });

      // Preview
      const previews = compressedFiles.map((file) => URL.createObjectURL(file));
      setPreviewImages(previews);
      console.log("✅ [FILE SELECT] Compression complete and previews ready");
    } catch (error) {
      console.error("Error during image compression:", error);
      toast.error("⚠️ Error processing images. Please try again.", {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setIsCompressing(false);
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("🚀 [UPLOAD] Starting item upload...");
    console.log("📝 [UPLOAD] Form data:", {
      name: formData.name,
      category: formData.category,
      imageCount: formData.images.length,
      imageSize: formData.images.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024
    });

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "images") {
        formData.images.forEach((file) => {
          data.append("images", file);
          console.log(`📦 [UPLOAD] Appending image: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
        });
      } else {
        data.append(key, formData[key]);
      }
    });

    console.log(`📊 [UPLOAD] Total FormData size: ~${formData.images.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024}MB`);
    console.log(`🌐 [UPLOAD] Backend URL: ${backendURL}`);
    console.log("🔌 [UPLOAD] CORS Origin: admin.bluewavesplumbing.com → api.bluewavesplumbing.com");

    try {
      console.log("📤 [UPLOAD] Sending request to backend...");
      const response = await axios.post(`${backendURL}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30000,
      });
      console.log("✅ [UPLOAD] Success! Response:", response.data);
      toast.success("✨ Item uploaded successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      setFormData({
        name: "",
        description: "",
        category: "",
        images: []
      });
      setPreviewImages([]);
    } catch (error) {
      console.error("❌ [UPLOAD] Error occurred!");
      console.error("📍 [ERROR] Error type:", error.name);
      console.error("💬 [ERROR] Message:", error.message);
      console.error("🔧 [ERROR] Code:", error.code);
      
      if (error.response) {
        // Server responded with error status
        console.error("🚨 [RESPONSE] Status:", error.response.status);
        console.error("🚨 [RESPONSE] Headers:", error.response.headers);
        console.error("🚨 [RESPONSE] Data:", error.response.data);
      } else if (error.request) {
        // Request made but no response
        console.error("📡 [REQUEST] No response received");
        console.error("📡 [REQUEST] Status:", error.request.status);
        console.error("📡 [REQUEST] Status text:", error.request.statusText);
        console.error("📡 [REQUEST] Response text:", error.request.responseText);
      } else {
        console.error("⚙️ [SETUP] Error in request setup:", error);
      }
      
      console.error("🔍 [DEBUG] Full error object:", error);

      const errorMessage = error.response?.data?.error || error.message || "Failed to upload item";
      toast.error(`❌ Upload failed: ${errorMessage}`, {
        position: "top-right",
        autoClose: 5000,
      });
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
            <option value="GI pipes & GI fittings">GI pipes & GI fittings</option>
            <option value="HDPE pipes & HDPE fittings">HDPE pipes & HDPE fittings</option>
            <option value="gutters & accessories">gutters & accessories</option>
            <option value="Toilet & Accessories">Toilet & Accessories</option>
            <option value="modern taps and sinks">modern taps and sinks</option>
            <option value="General Items">General Items</option>
            <option value="Waste pipes & Fittings">Waste pipes & Fittings</option>
          </select>
        </div>

        {/* Upload Images */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Upload Images {isCompressing && <span className="text-blue-600 text-sm">(Compressing...)</span>}
          </label>
          <input
            type="file"
            name="images"
            multiple
            required
            onChange={handleFileChange}
            disabled={isCompressing}
            className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {isCompressing && <p className="text-blue-600 text-sm mt-2">📦 Processing and compressing images...</p>}
          <div className="flex gap-3 mt-3 flex-wrap">
            {previewImages.map((src, index) => (
              <img
                key={index}
                src={src}
                alt="Preview"
                className="w-20 h-20 object-contain bg-gray-50 rounded-lg border"
              />
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isCompressing}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCompressing ? "Processing Images..." : "Upload Item"}
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
