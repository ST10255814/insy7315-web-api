import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useCallback } from "react";
import { FaTrash, FaPlusCircle, FaTimes } from "react-icons/fa";
import { availableAmenities } from "../constants/amenities.js";

// Initial form state - defined outside to prevent dependency issues
const INITIAL_FORM_STATE = {
  title: "",
  address: "",
  description: "",
  amenities: [],
  imageURL: [],
  price: "",
};

export default function AddPropertyModal({ show, onClose, onSubmit, formData, setFormData, isPending }) {
  const fileInputRef = useRef(null);

  // Reset form function
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
  }, [setFormData]);

  // Reset form when modal closes
  useEffect(() => {
    if (!show) {
      resetForm();
    }
  }, [show, resetForm]);

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
    });
  };

  // --- Remove Image ---
  const handleRemoveImage = (index) => {
    const updatedImages = formData.imageURL.filter((_, i) => i !== index);
    setFormData({ ...formData, imageURL: updatedImages });
  };

  // --- Handle Amenities ---
  const handleAmenityChange = (e) => {
    const value = e.target.value;
    if (value && !formData.amenities.includes(value)) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, value],
      });
    }
  };

  const handleRemoveAmenity = (index) => {
    const updatedAmenities = formData.amenities.filter((_, i) => i !== index);
    setFormData({ ...formData, amenities: updatedAmenities });
  };

  // --- Submit Form ---
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-60 flex items-center justify-center bg-gray-900/30 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl relative"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Add New Property
              </h2>
              <button 
                onClick={handleClose} 
                className="text-gray-500 hover:text-gray-700 transition-colors p-1"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
                <input
                  type="number"
                  placeholder="Rent Amount"
                  value={formData.rent}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <textarea
                placeholder="Property Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none w-full min-h-[90px]"
                required
              />

              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none w-full"
                required
              />

              {/* Amenities Dropdown */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Amenities
                </label>
                <select
                  onChange={handleAmenityChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
                  value=""
                >
                  <option value="" disabled>
                    Select an amenity
                  </option>
                  {availableAmenities.map((amenity, index) => (
                    <option key={index} value={amenity}>
                      {amenity}
                    </option>
                  ))}
                </select>

                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                    >
                      {amenity}
                      <button
                        type="button"
                        onClick={() => handleRemoveAmenity(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image Uploads */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Property Images
                </label>
                <div className="flex flex-wrap gap-3">
                  {formData.imageURL.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Property ${index}`}
                        className="w-28 h-28 object-cover rounded-lg shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md text-red-600 hover:text-red-800"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="w-28 h-28 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50"
                  >
                    <FaPlusCircle className="text-blue-500 text-xl" />
                    <span className="text-sm">Add Image</span>
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <motion.button
                  type="button"
                  onClick={handleClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={isPending}
                  whileHover={!isPending ? { scale: 1.02 } : {}}
                  whileTap={!isPending ? { scale: 0.98 } : {}}
                  className={`px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
                    isPending 
                      ? "bg-blue-400 text-white cursor-not-allowed" 
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isPending ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      Adding...
                    </>
                  ) : (
                    <>
                      <FaPlusCircle />
                      Add Property
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
