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
  const [isUploading, setIsUploading] = useState(false);
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

    // Prevent double submission
    if (isUploading || isCompressing) {
      toast.warning("Please wait for the current upload to complete.", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    // Validate form
    if (!formData.name.trim() || !formData.description.trim() || !formData.category || formData.images.length === 0) {
      toast.error("Please fill all fields and select images.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

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

    setIsUploading(true);

    try {
      console.log("📤 [UPLOAD] Sending request to backend...");
      const response = await axios.post(`${backendURL}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30000,
      });
      console.log("✅ [UPLOAD] Success! Response:", response.data);
      toast.success("Item uploaded successfully!", {
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
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-6 sm:py-8 px-4 sm:px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl mx-auto bg-white p-5 sm:p-8 rounded-2xl shadow-lg"
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-8 text-blue-700">
          Upload New Item
        </h2>

        {/* Item Name */}
        <div className="mb-5 sm:mb-6">
          <label className="block text-gray-700 font-semibold text-sm sm:text-base mb-2">
            Item Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter item name"
            className="w-full px-4 py-3 sm:py-4 text-base sm:text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition"
          />
        </div>

        {/* Description */}
        <div className="mb-5 sm:mb-6">
          <label className="block text-gray-700 font-semibold text-sm sm:text-base mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Enter item description"
            rows="4"
            className="w-full px-4 py-3 sm:py-4 text-base sm:text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition resize-none"
          ></textarea>
        </div>

        {/* Category */}
        <div className="mb-5 sm:mb-6">
          <label className="block text-gray-700 font-semibold text-sm sm:text-base mb-2">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 sm:py-4 text-base sm:text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition bg-white"
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
        <div className="mb-5 sm:mb-6">
          <label className="block text-gray-700 font-semibold text-sm sm:text-base mb-2">
            Upload Images *
            {isCompressing && (
              <span className="text-blue-600 text-xs sm:text-sm font-normal ml-2">
                (Compressing...)
              </span>
            )}
          </label>
          <input
            type="file"
            name="images"
            multiple
            required
            onChange={handleFileChange}
            disabled={isCompressing}
            accept="image/*"
            className="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition disabled:opacity-50 disabled:cursor-not-allowed file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {isCompressing && (
            <p className="text-blue-600 text-xs sm:text-sm mt-2 flex items-center">
              <svg className="w-4 h-4 mr-1 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Processing and compressing images...
            </p>
          )}
          
          {/* Image Previews */}
          {previewImages.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-3">Preview ({previewImages.length} image{previewImages.length !== 1 ? 's' : ''}):</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3">
                {previewImages.map((src, index) => (
                  <div
                    key={index}
                    className="relative group"
                  >
                    <img
                      src={src}
                      alt={`Preview ${index + 1}`}
                      className="w-full aspect-square object-contain bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-400 transition"
                    />
                    <div className="text-xs text-gray-500 text-center mt-1 group-hover:text-gray-700">
                      #{index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isCompressing || isUploading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 sm:py-4 px-6 rounded-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-base sm:text-lg flex items-center justify-center"
        >
          {isCompressing ? (
            <>
              <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Processing...
            </>
          ) : isUploading ? (
            <>
              <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Uploading...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3v-7" />
              </svg>
              Upload Item
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
