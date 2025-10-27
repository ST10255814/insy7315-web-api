import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaSave, FaImage, FaPlus, FaTimes } from "react-icons/fa";
import { TabWrapper, StateHandler, ActionButton } from "../../common/index.js";
import { AmenitySelector } from "../../common/forms";
import Toast from "../../../lib/toast.js";
import { formatAmount } from "../../../utils/formatters.js";

export default function EditProperty() {
  const { userId: adminId, propertyId } = useParams();
  const navigate = useNavigate();

  // Mock data for UI display - using useMemo to prevent dependency issues
  const property = useMemo(
    () => ({
      listingId: propertyId,
      title: "Modern Downtown Apartment",
      address: "123 Main Street, City Center, NY 10001",
      description:
        "Beautiful modern apartment in the heart of downtown. Features include hardwood floors, stainless steel appliances, and stunning city views. Perfect for professionals or small families.",
      price: "2500",
      status: "Available",
      amenities: ["WiFi", "Parking", "Gym", "Pool", "Laundry", "Pet Friendly"],
      imageURL: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      ],
    }),
    [propertyId]
  );

  const isLoading = false;
  const isError = false;
  const [isPending, setIsPending] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    address: "",
    description: "",
    amenities: [],
    imageURL: [],
    imageFiles: [],
    price: "",
    status: "",
  });

  // Available status options
  const statusOptions = [
    "Available",
    "Occupied",
    "Maintenance",
    "Under Review",
  ]; // Populate form data when property loads
  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || "",
        address: property.address || "",
        description: property.description || "",
        amenities: property.amenities || [],
        imageURL: property.imageURL || [],
        imageFiles: [],
        price: property.price || "",
        status: property.status || "",
      });
    }
  }, [property]);

  const handleBack = () => {
    navigate(`/dashboard/${adminId}/properties`);
  };

  const handleViewProperty = () => {
    navigate(`/dashboard/${adminId}/properties/view/${propertyId}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAmenitiesChange = (selectedAmenities) => {
    setFormData((prev) => ({ ...prev, amenities: selectedAmenities }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        Toast.error("Please select only image files");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Toast.error("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          imageURL: [...prev.imageURL, event.target.result],
          imageFiles: [...prev.imageFiles, file],
        }));
      };
      reader.readAsDataURL(file);
    });

    // Reset the input
    e.target.value = "";
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);

    files.forEach((file) => {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        Toast.error("Please select only image files");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Toast.error("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          imageURL: [...prev.imageURL, event.target.result],
          imageFiles: [...prev.imageFiles, file],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleImageRemove = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageURL: prev.imageURL.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsPending(true);

    // Mock submission with delay
    setTimeout(() => {
      setIsPending(false);
      Toast.success("Property updated successfully! (Mock functionality)");
      navigate(`/dashboard/${adminId}/properties/view/${propertyId}`);
    }, 2000);
  };

  const handleCancel = () => {
    navigate(`/dashboard/${adminId}/properties/view/${propertyId}`);
  };

  return (
    <TabWrapper decorativeElements="default">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <ActionButton
              onClick={handleBack}
              icon={FaArrowLeft}
              variant="secondary"
              size="small"
            >
              Back to Properties
            </ActionButton>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Edit Property
              </h1>
              <p className="text-gray-600">
                Update the details for "{property?.title}"
              </p>
            </div>
          </div>

          <ActionButton
            onClick={handleViewProperty}
            variant="outline"
            size="small"
          >
            View Property
          </ActionButton>
        </div>

        <StateHandler
          isLoading={isLoading}
          isError={isError}
          data={property}
          errorMessage="Failed to load property details for editing. Please try again."
          emptyMessage="Property not found."
        >
          {property && (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content - Left Side */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Basic Information */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-2xl shadow-lg border border-white/20 p-6"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Basic Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Property Title *
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Enter property title"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Monthly Rent *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            R
                          </span>
                          <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="0.00"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter full address"
                        required
                      />
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        placeholder="Describe the property features and highlights..."
                      />
                    </div>
                  </motion.div>

                  {/* Amenities */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="bg-white rounded-2xl shadow-lg border border-white/20 p-6"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Amenities
                    </h2>

                    <AmenitySelector
                      selectedAmenities={formData.amenities}
                      onChange={handleAmenitiesChange}
                      label=""
                      placeholder="Select amenities for this property..."
                    />
                  </motion.div>

                  {/* Images */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-lg border border-white/20 p-6"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Property Images
                    </h2>

                    <div
                      className="border-2 border-dashed border-gray-200 rounded-lg p-4 mb-4 transition-colors hover:border-gray-300"
                      onDrop={handleImageDrop}
                      onDragOver={handleDragOver}
                    >
                      {formData.imageURL.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {formData.imageURL.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image}
                                alt={`Property view ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => handleImageRemove(index)}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <FaTimes className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <FaImage className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <p className="text-gray-500">
                            Drag and drop images here or click the button below
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-4">
                      <input
                        type="file"
                        id="imageUpload"
                        multiple
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="imageUpload"
                        className="w-full px-4 py-3 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <FaPlus className="w-4 h-4" />
                        {formData.imageURL.length > 0
                          ? "Add More Images"
                          : "Add Images"}
                      </label>
                      <div className="mt-2 text-center">
                        {formData.imageURL.length > 0 && (
                          <p className="text-sm text-gray-600 mb-1">
                            {formData.imageURL.length} image
                            {formData.imageURL.length !== 1 ? "s" : ""} uploaded
                          </p>
                        )}
                        <p className="text-xs text-gray-400">
                          Supports: JPEG, PNG, GIF, WebP (max 5MB each)
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Sidebar - Right Side */}
                <div className="space-y-6">
                  {/* Status */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="bg-white rounded-2xl shadow-lg border border-white/20 p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Property Status
                    </h3>

                    <div className="space-y-2">
                      {statusOptions.map((status) => (
                        <label
                          key={status}
                          className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                            formData.status === status
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="status"
                            value={status}
                            checked={formData.status === status}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <span
                            className={`text-sm font-medium ${
                              formData.status === status
                                ? "text-blue-700"
                                : "text-gray-700"
                            }`}
                          >
                            {status}
                          </span>
                        </label>
                      ))}
                    </div>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="bg-white rounded-2xl shadow-lg border border-white/20 p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Actions
                    </h3>

                    <div className="space-y-3">
                      <ActionButton
                        type="submit"
                        icon={FaSave}
                        variant="primary"
                        size="medium"
                        disabled={isPending}
                        className="w-full"
                      >
                        {isPending ? "Saving..." : "Save Changes"}
                      </ActionButton>

                      <ActionButton
                        type="button"
                        onClick={handleCancel}
                        variant="secondary"
                        size="medium"
                        className="w-full"
                      >
                        Cancel
                      </ActionButton>
                    </div>
                  </motion.div>

                  {/* Property Info */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="bg-gray-50 rounded-2xl p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Property Info
                    </h3>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Property ID:</span>
                        <span className="font-medium">{propertyId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Status:</span>
                        <span className="font-medium">{property.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Rent:</span>
                        <span className="font-medium">R {formatAmount(property.price)}</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </form>
          )}
        </StateHandler>
      </div>
    </TabWrapper>
  );
}
