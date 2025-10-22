import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useCallback, useState } from "react";
import { FaPlusCircle, FaTimes, FaChevronDown } from "react-icons/fa";
import { availableAmenities } from "../constants/amenities.js";

// Initial form state - defined outside to prevent dependency issues
const INITIAL_FORM_STATE = {
  title: "",
  address: "",
  description: "",
  amenities: [],
  imageURL: [], // For preview URLs
  imageFiles: [], // For actual file objects
  price: "",
};

export default function AddPropertyModal({ show, onClose, onSubmit, formData, setFormData, isPending }) {
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [isAmenitiesOpen, setIsAmenitiesOpen] = useState(false);
  const [errors, setErrors] = useState({});
  
  const buttonHoverTransition = { type: "spring", stiffness: 300, damping: 20 };

  // Reset form function
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
  }, [setFormData]);

  // Reset form when modal closes
  useEffect(() => {
    if (!show) {
      // Clean up object URLs before resetting
      formData.imageURL.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
      resetForm();
      setIsAmenitiesOpen(false);
      setErrors({});
    }
  }, [show, resetForm, formData.imageURL]);

  // Handle input changes and clear errors
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsAmenitiesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle close with unsaved changes confirmation
  const handleClose = () => {
    onClose();
  };

  if (!show) return null;

  // --- Handle Image Upload ---
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setFormData({
      ...formData,
      imageURL: [...formData.imageURL, ...newImages],
      imageFiles: [...formData.imageFiles, ...files],
    });
    
    // Clear image error when images are added
    if (errors.images) {
      setErrors({ ...errors, images: "" });
    }
  };

  // --- Remove Image ---
  const handleRemoveImage = (index) => {
    console.log('handleRemoveImage called with index:', index);
    console.log('Current imageURL array:', formData.imageURL);
    console.log('Current imageFiles array:', formData.imageFiles);
    
    // Revoke the object URL to prevent memory leaks
    if (formData.imageURL[index]) {
      URL.revokeObjectURL(formData.imageURL[index]);
    }
    
    const updatedImages = formData.imageURL.filter((_, i) => i !== index);
    const updatedFiles = formData.imageFiles.filter((_, i) => i !== index);
    
    console.log('Updated imageURL array:', updatedImages);
    console.log('Updated imageFiles array:', updatedFiles);
    
    setFormData({ 
      ...formData, 
      imageURL: updatedImages,
      imageFiles: updatedFiles
    });
  };



  // --- Handle Amenities ---
  const handleAmenitySelect = (amenity) => {
    if (!formData.amenities.includes(amenity)) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenity],
      });
      
      // Clear amenities error when amenities are added
      if (errors.amenities) {
        setErrors({ ...errors, amenities: "" });
      }
    }
    setIsAmenitiesOpen(false);
  };

  const handleRemoveAmenity = (index) => {
    const updatedAmenities = formData.amenities.filter((_, i) => i !== index);
    setFormData({ ...formData, amenities: updatedAmenities });
    
    // If removing the last amenity and there's no error yet, don't add one here
    // The error will show on form submission if needed
  };

  // --- Submit Form ---
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Reset previous errors
    const newErrors = {};
    
    // Basic validation
    if (!formData.title.trim()) {
      newErrors.title = "Property title is required";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Valid rent amount is required";
    }
    if (formData.imageFiles.length === 0) {
      newErrors.images = "Please add at least one property image";
    }
    if (formData.amenities.length === 0) {
      newErrors.amenities = "Please select at least one amenity";
    }
    
    // If there are errors, set them and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Clear any existing errors and submit
    setErrors({});
    onSubmit(e);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-60 flex items-center justify-center bg-gray-900/30 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl relative max-h-[75vh] sm:max-h-[80vh] flex flex-col border border-gray-200"
          >
            {/* Header - Fixed */}
            <div className="flex justify-between items-start p-3 sm:p-4 pb-2 sm:pb-3 border-b border-gray-200 flex-shrink-0">
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-blue-800">
                  Add New Property
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Create a new property listing for rental</p>
              </div>
              <button 
                onClick={handleClose} 
                className="text-gray-500 hover:text-gray-700 transition-colors ml-3 sm:ml-4"
              >
                <FaTimes size={14} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-2 sm:py-3 min-h-0">
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
                {/* Basic Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-blue-700 mb-1 sm:mb-2">Property Title</label>
                    <input
                      type="text"
                      placeholder="Enter property title..."
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className={`w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-xl shadow-sm focus:ring-2 transition outline-none text-sm ${
                        errors.title
                          ? "border-red-500 focus:ring-red-400"
                          : "border-gray-300 focus:ring-blue-700"
                      }`}
                    />
                    {errors.title && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1 font-medium"
                      >
                        {errors.title}
                      </motion.p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-blue-700 mb-1 sm:mb-2">Monthly Rent</label>
                    <input
                      type="number"
                      placeholder="Amount (R)"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      className={`w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-xl shadow-sm focus:ring-2 transition outline-none text-sm ${
                        errors.price
                          ? "border-red-500 focus:ring-red-400"
                          : "border-gray-300 focus:ring-blue-700"
                      }`}
                    />
                    {errors.price && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1 font-medium"
                      >
                        {errors.price}
                      </motion.p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-1 sm:mb-2">Address</label>
                  <input
                    type="text"
                    placeholder="Enter full property address..."
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-xl shadow-sm focus:ring-2 transition outline-none text-sm ${
                      errors.address
                        ? "border-red-500 focus:ring-red-400"
                        : "border-gray-300 focus:ring-blue-700"
                    }`}
                  />
                  {errors.address && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1 font-medium"
                    >
                      {errors.address}
                    </motion.p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-1 sm:mb-2">Description</label>
                  <textarea
                    placeholder="Describe the property features, location benefits, etc..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className={`w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-xl shadow-sm focus:ring-2 transition outline-none min-h-[80px] sm:min-h-[100px] resize-none text-sm ${
                      errors.description
                        ? "border-red-500 focus:ring-red-400"
                        : "border-gray-300 focus:ring-blue-700"
                    }`}
                  />
                  {errors.description && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1 font-medium"
                    >
                      {errors.description}
                    </motion.p>
                  )}
                </div>

                {/* Amenities Section */}
                <div className="relative" ref={dropdownRef}>
                  <label className="block text-sm font-semibold text-blue-700 mb-1 sm:mb-2">
                    Amenities
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsAmenitiesOpen(!isAmenitiesOpen)}
                    className={`w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-xl shadow-sm focus:ring-2 transition outline-none text-left flex items-center justify-between hover:bg-gray-50 text-sm ${
                      errors.amenities
                        ? "border-red-500 focus:ring-red-400"
                        : "border-gray-300 focus:ring-blue-700"
                    }`}
                  >
                    <span className="text-gray-500">
                      {formData.amenities.length > 0 
                        ? `${formData.amenities.length} amenities selected`
                        : "Select amenities to add..."
                      }
                    </span>
                    <FaChevronDown 
                      className={`text-gray-400 transition-transform duration-200 ${
                        isAmenitiesOpen ? 'rotate-180' : ''
                      }`}
                      size={12}
                    />
                  </button>

                  {/* Custom Dropdown */}
                  <AnimatePresence>
                    {isAmenitiesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-32 sm:max-h-40 overflow-y-auto"
                      >
                        {availableAmenities.map((amenity, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleAmenitySelect(amenity)}
                            disabled={formData.amenities.includes(amenity)}
                            className={`w-full px-3 py-2 text-left text-xs sm:text-sm hover:bg-blue-50 transition-colors ${
                              formData.amenities.includes(amenity)
                                ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                : 'text-gray-700 hover:text-blue-600'
                            }`}
                          >
                            {amenity}
                            {formData.amenities.includes(amenity) && (
                              <span className="ml-2 text-xs">✓ Added</span>
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {formData.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {formData.amenities.map((amenity, index) => (
                        <div
                          key={index}
                          className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center gap-1 text-xs"
                        >
                          {amenity}
                          <button
                            type="button"
                            onClick={() => handleRemoveAmenity(index)}
                            className="text-red-500 hover:text-red-700 ml-1"
                          >
                            <FaTimes size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {errors.amenities && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-2 font-medium"
                    >
                      {errors.amenities}
                    </motion.p>
                  )}
                </div>

                {/* Image Uploads */}
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Property Images
                  </label>
                  
                  <div className={`bg-gray-50 rounded-xl p-4 border transition-colors ${
                    errors.images ? "border-red-500 bg-red-50/50" : "border-gray-200"
                  }`}>
                    {/* Image Preview Section */}
                    {formData.imageURL.length > 0 ? (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-gray-700">
                            {formData.imageURL.length} image{formData.imageURL.length !== 1 ? 's' : ''} selected
                          </span>
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              fileInputRef.current?.click();
                            }}
                            className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1"
                          >
                            <FaPlusCircle size={12} />
                            Add More
                          </motion.button>
                        </div>
                        
                        <AnimatePresence mode="popLayout">
                          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                            {formData.imageURL.map((url, index) => (
                              <motion.div 
                                key={`${url}-${index}`}
                                layout
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.6, y: -10 }}
                                transition={{ 
                                  duration: 0.3, 
                                  ease: "easeInOut",
                                  layout: { duration: 0.2 }
                                }}
                                className="relative aspect-square group"
                              >
                                {/* Remove button positioned outside the image container */}
                                <button
                                  type="button"
                                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-all duration-200 z-20 border-2 border-white"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    console.log('Remove button clicked for index:', index);
                                    handleRemoveImage(index);
                                  }}
                                >
                                  <FaTimes size={12} />
                                </button>
                                
                                <div className="relative w-full h-full rounded-lg overflow-hidden bg-white border-2 border-gray-200 group-hover:border-blue-400 transition-all shadow-sm">
                                  <img
                                    src={url}
                                    alt={`Property ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                  
                                  {/* Image number badge */}
                                  <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-md font-medium"
                                  >
                                    {index + 1}
                                  </motion.div>
                                  
                                  {/* Primary image indicator */}
                                  {index === 0 && (
                                    <motion.div 
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: 0.2 }}
                                      className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-md font-medium"
                                    >
                                      Main
                                    </motion.div>
                                  )}
                                  
                                  {/* Overlay on hover */}
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 pointer-events-none" />
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </AnimatePresence>
                      </div>
                    ) : (
                      /* Empty State Upload Area */
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="border-2 border-dashed border-blue-300 rounded-lg bg-white hover:bg-blue-50/50 transition-all cursor-pointer p-8 text-center"
                      >
                        <motion.div
                          animate={{ y: [0, -3, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          className="mb-3"
                        >
                          <FaPlusCircle className="text-blue-500 text-3xl mx-auto" />
                        </motion.div>
                        <h4 className="text-blue-700 font-semibold mb-1">Upload Property Images</h4>
                        <p className="text-blue-500 text-sm">Click here or drag & drop your images</p>
                        <p className="text-gray-400 text-xs mt-2">PNG, JPG, JPEG up to 10MB each</p>
                      </motion.div>
                    )}
                    
                    {/* Always available "Add Images" button when images exist */}
                    {formData.imageURL.length > 0 && (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="w-full border-2 border-dashed border-blue-300 rounded-lg bg-white hover:bg-blue-50/50 transition-all p-3 flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <FaPlusCircle size={16} />
                        Add More Images
                      </motion.button>
                    )}
                    
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  
                  {errors.images && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-2 font-medium"
                    >
                      {errors.images}
                    </motion.p>
                  )}
                </div>
              </form>
            </div>

            {/* Fixed Footer with Buttons */}
            <div className="border-t border-gray-200 px-3 sm:px-4 py-2 sm:py-3 flex-shrink-0">
              <div className="flex justify-end gap-3 sm:gap-4">
                <motion.button
                  type="button"
                  onClick={handleClose}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={buttonHoverTransition}
                  className="px-4 py-2 sm:px-5 rounded-xl font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 shadow text-sm"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={isPending}
                  onClick={handleSubmit}
                  whileHover={!isPending ? { scale: 1.05 } : {}}
                  whileTap={!isPending ? { scale: 0.95 } : {}}
                  transition={buttonHoverTransition}
                  className={`px-4 py-2 sm:px-5 rounded-xl font-semibold text-white shadow flex items-center justify-center gap-2 text-sm ${
                    isPending 
                      ? "bg-blue-400 cursor-not-allowed" 
                      : "bg-blue-700 hover:bg-blue-800"
                  }`}
                >
                  {isPending ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <FaPlusCircle /> Add Property
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
