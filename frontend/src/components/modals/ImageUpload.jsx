import React, { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FaImage, FaPlusCircle, FaTimes, FaCloudUploadAlt, FaCheckCircle } from "react-icons/fa";

/**
 * Reusable Image Upload Component
 * Handles multiple image upload with preview and remove functionality
 */
export default function ImageUpload({ 
  imageURLs = [], 
  imageFiles = [], 
  onImagesChange, 
  error = "", 
  className = "",
  maxImages = 10,
  maxSizeMessage = "Max 10MB per image"
}) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("preview"); // Tab state

  // Enhanced file validation
  const validateFile = useCallback((file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!validTypes.includes(file.type)) {
      return `${file.name}: Invalid file type. Please use JPEG, PNG, GIF, or WebP.`;
    }
    
    if (file.size > maxSize) {
      return `${file.name}: File too large. Maximum size is 10MB.`;
    }
    
    return null;
  }, []);

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      await processFiles(files);
    }
  };

  const processFiles = async (files) => {
    if (files.length === 0) return;
    
    // Check if adding these files would exceed the limit
    const currentCount = Math.max(imageFiles?.length || 0, imageURLs?.length || 0);
    if (currentCount + files.length > maxImages) {
      onImagesChange(imageFiles, imageURLs, `Cannot add ${files.length} images. Maximum ${maxImages} images allowed.`);
      return;
    }

    // Validate each file
    const validationErrors = [];
    const validFiles = [];
    
    for (const file of files) {
      const error = validateFile(file);
      if (error) {
        validationErrors.push(error);
      } else {
        validFiles.push(file);
      }
    }
    
    if (validationErrors.length > 0) {
      onImagesChange(imageFiles, imageURLs, validationErrors.join('\n'));
      return;
    }
    
    if (validFiles.length === 0) return;
    
    setIsProcessing(true);
    
    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    const newImageFiles = [...(imageFiles || []), ...validFiles];
    const newImageURLs = [...(imageURLs || [])];
    
    validFiles.forEach(file => {
      newImageURLs.push(URL.createObjectURL(file));
    });
    
    // Show success feedback
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 2000);
    
    onImagesChange(newImageFiles, newImageURLs, "");
    setIsProcessing(false);
  };

  // Handle file upload
  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    await processFiles(files);
    // Reset the input so the same file can be selected again
    event.target.value = '';
  };

  // Remove image
  const removeImage = (index) => {
    const newImageFiles = imageFiles.filter((_, i) => i !== index);
    const newImageURLs = imageURLs.filter((_, i) => i !== index);
    
    // Clean up the removed URL
    if (imageURLs[index] && imageURLs[index].startsWith('blob:')) {
      URL.revokeObjectURL(imageURLs[index]);
    }
    
    onImagesChange(newImageFiles, newImageURLs, "");
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <motion.div
        className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-300 ${
          isDragOver 
            ? 'border-blue-400 bg-blue-50 scale-105' 
            : error 
            ? 'border-red-300 hover:border-red-400 bg-red-50/30' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30'
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {(!imageFiles || imageFiles.length === 0) && (!imageURLs || imageURLs.length === 0) ? (
          // Show upload area when no files
          <div className="space-y-4">
            <motion.div 
              className="flex justify-center"
              animate={isDragOver ? { scale: 1.2, rotate: 5 } : { scale: 1, rotate: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isProcessing ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full"
                />
              ) : uploadSuccess ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <FaCheckCircle className="w-8 h-8 text-white" />
                </motion.div>
              ) : isDragOver ? (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"
                >
                  <FaCloudUploadAlt className="w-8 h-8 text-blue-500" />
                </motion.div>
              ) : (
                <div className="relative p-4 bg-gray-50 rounded-full">
                  <FaImage className="w-8 h-8 text-gray-400" />
                  <motion.div
                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaPlusCircle className="w-4 h-4 text-white" />
                  </motion.div>
                </div>
              )}
            </motion.div>
            
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-700 mb-1">
                {isProcessing 
                  ? 'Processing images...' 
                  : uploadSuccess
                  ? 'Images uploaded successfully!'
                  : isDragOver 
                  ? 'Drop images here' 
                  : 'Upload Property Images'
                }
              </p>
              <p className="text-xs text-gray-500">
                {maxSizeMessage} • Max {maxImages} images • JPEG, PNG, GIF, WebP
              </p>
              {!isDragOver && !isProcessing && !uploadSuccess && (
                <p className="text-xs text-blue-600 mt-2 font-medium">
                  Click here or drag & drop files
                </p>
              )}
            </div>
          </div>
        ) : (
          // Tabbed preview area
          <div className="space-y-3">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-2">
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium focus:outline-none transition-colors duration-200 border-b-2 ${activeTab === "preview" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-blue-500"}`}
                onClick={e => { e.stopPropagation(); setActiveTab("preview"); }}
              >
                Preview
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium focus:outline-none transition-colors duration-200 border-b-2 ${activeTab === "details" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-blue-500"}`}
                onClick={e => { e.stopPropagation(); setActiveTab("details"); }}
              >
                Details
              </button>
              <div className="flex-1" />
              <button
                type="button"
                onClick={e => { e.stopPropagation(); onImagesChange([], [], ""); }}
                className="text-xs text-red-600 hover:text-red-700 font-medium hover:underline transition-colors ml-2"
              >
                Clear All
              </button>
            </div>
            {/* Tab content */}
            {activeTab === "preview" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {imageURLs && imageURLs.map((url, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="relative overflow-hidden rounded-2xl border-2 border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 group-hover:border-blue-300">
                      <img
                        src={url}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-20 sm:h-24 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {/* Dark overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {/* Action buttons - centered within image */}
                      <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                        {/* Expand button removed */}
                        {/* Remove button */}
                        <motion.button
                          type="button"
                          onClick={e => { e.stopPropagation(); removeImage(index); }}
                          className="w-7 h-7 bg-white/20 hover:bg-red-500 backdrop-blur-md text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 border border-white/30 hover:border-red-400"
                          whileHover={{ scale: 1.15, rotate: -3 }}
                          whileTap={{ scale: 0.9 }}
                          title="Remove image"
                        >
                          <FaTimes size={9} />
                        </motion.button>
                      </div>
                      {/* File info at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <div className="flex justify-between items-center text-white text-xs">
                          <span className="truncate flex-1 mr-2">
                            {imageFiles && imageFiles[index] ? imageFiles[index].name.split('.')[0] : `Image ${index + 1}`}
                          </span>
                          {imageFiles && imageFiles[index] && (
                            <span className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-medium">
                              {(imageFiles[index].size / 1024 / 1024).toFixed(1)}MB
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              // Details tab
              <div className="space-y-2">
                {imageFiles && imageFiles.length > 0 ? (
                  imageFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 border border-gray-200">
                      <span className="font-medium text-gray-700 truncate w-32">{file.name}</span>
                      <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      <span className="text-xs text-gray-400">{file.type}</span>
                      <button
                        type="button"
                        className="ml-auto text-red-500 hover:text-red-700 text-xs font-medium"
                        onClick={e => { e.stopPropagation(); removeImage(idx); }}
                      >Remove</button>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-sm">No image details available.</div>
                )}
              </div>
            )}
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500">
                <span className="font-medium">Click to add more</span> • {Math.max(imageFiles?.length || 0, imageURLs?.length || 0)}/{maxImages} images
              </p>
              {Math.max(imageFiles?.length || 0, imageURLs?.length || 0) < maxImages && (
                <span className="text-xs text-blue-600 font-medium">
                  +{maxImages - Math.max(imageFiles?.length || 0, imageURLs?.length || 0)} more
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Enhanced Progress indicator */}
        {(imageFiles?.length > 0 || imageURLs?.length > 0) && (
          <div className="absolute bottom-1 left-1 right-1">
            <div className="w-full bg-gray-200 rounded-full h-1.5 shadow-inner">
              <motion.div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-1.5 rounded-full shadow-sm"
                initial={{ width: 0 }}
                animate={{ width: `${(Math.max(imageFiles?.length || 0, imageURLs?.length || 0) / maxImages) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            {/* Progress text */}
            <div className="absolute -top-6 right-0 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              {Math.max(imageFiles?.length || 0, imageURLs?.length || 0)}/{maxImages}
            </div>
          </div>
        )}
      </motion.div>
      
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      
      {error && (
        <p className="text-red-500 text-xs sm:text-sm font-medium flex items-center gap-1">
          <span className="w-1 h-1 bg-red-500 rounded-full"></span>
          <span className="whitespace-pre-line">{error}</span>
        </p>
      )}
    </div>
  );
}