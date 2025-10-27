import { useEffect, useCallback, useState } from "react";
import { FaPlusCircle, FaArrowLeft } from "react-icons/fa";
import { availableAmenities } from "../../../constants/amenities.js";
import {
  AmenitiesSelector,
  ImageUpload,
} from "../../modals/index.js";
import TabWrapper from "../../common/TabWrapper.jsx";
import FormField from "../../common/FormField.jsx";
import FormInput from "../../common/FormInput.jsx";
import Toast from "../../../lib/toast.js";
import { useCreateListingMutation } from "../../../utils/queries.js";
import { useParams, useNavigate } from "react-router-dom";

export default function AddProperty() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    description: "",
    amenities: [],
    imageURL: [], // For preview URLs
    imageFiles: [], // For actual file objects
    price: "",
  });
  const createListingMutation = useCreateListingMutation();
  const isPending = createListingMutation.isPending;
  // Reset form function
  const resetForm = useCallback(() => {
    // Clean up image preview URLs
    formData.imageURL.forEach((url) => {
      if (url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    });
    setFormData({
      title: "",
      address: "",
      description: "",
      amenities: [],
      imageURL: [],
      imageFiles: [],
      price: "",
    });
    setErrors({});
    Toast.info("Form has been reset");
  }, [formData.imageURL, setFormData]);

  // Reset form when modal closes
  useEffect(() => {
    // Clean up object URLs on unmount
    return () => {
      formData.imageURL.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [formData.imageURL]);

  // Handle input changes and clear errors
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  // Handle amenities change from reusable component
  const handleAmenitiesChange = (selectedAmenities, error) => {
    handleInputChange("amenities", selectedAmenities);
    if (error) {
      setErrors({ ...errors, amenities: error });
    } else if (errors.amenities) {
      setErrors({ ...errors, amenities: "" });
    }
  };

  // Handle images change from reusable component
  const handleImagesChange = (files, urls, error) => {
    handleInputChange("imageFiles", files);
    handleInputChange("imageURL", urls);
    if (error) {
      setErrors({ ...errors, images: error });
    } else if (errors.images) {
      setErrors({ ...errors, images: "" });
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Property title is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Valid price is required";
    if ((formData.imageFiles.length === 0 && formData.imageURL.length === 0))
      newErrors.images = "At least one image is required";
    if (!formData.amenities || formData.amenities.length === 0)
      newErrors.amenities = "At least one amenity must be selected";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setErrors({});
    createListingMutation.mutate(formData, {
      onSuccess: () => {
        navigate(`/dashboard/${userId}/properties`);
      }
    });
  };

  return (
    <TabWrapper decorativeElements="default">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
            onClick={() => navigate(`/dashboard/${userId}/properties`)}
          >
            <FaArrowLeft /> Back to Properties
          </button>
          <h1 className="text-3xl font-bold text-blue-700 flex items-center gap-2"> Add a New Property
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Left Side */}
            <div className="lg:col-span-2 space-y-8">
              {/* Basic Information */}
              <div className="bg-white rounded-2xl shadow-lg border border-white/20 p-6">
                <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white font-bold mr-2">1</span>
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Property Title" error={errors.title}>
                    <FormInput
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={e => handleInputChange("title", e.target.value)}
                      placeholder="e.g., Modern 2BR Apartment"
                      hasError={!!errors.title}
                      disabled={isPending}
                    />
                  </FormField>
                  <FormField label="Monthly Rent" error={errors.price}>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R</span>
                      <FormInput
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={e => handleInputChange("price", e.target.value)}
                        className="pl-8 pr-4"
                        placeholder="0.00"
                        hasError={!!errors.price}
                        disabled={isPending}
                      />
                    </div>
                  </FormField>
                </div>
                <div className="mt-6">
                  <FormField label="Address" error={errors.address}>
                    <FormInput
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={e => handleInputChange("address", e.target.value)}
                      placeholder="e.g., 123 Main Street, Johannesburg"
                      hasError={!!errors.address}
                      disabled={isPending}
                    />
                  </FormField>
                </div>
                <div className="mt-6">
                  <FormField label="Description" error={errors.description}>
                    <FormInput
                      as="textarea"
                      name="description"
                      value={formData.description}
                      onChange={e => handleInputChange("description", e.target.value)}
                      placeholder="Describe the property features and highlights..."
                      hasError={!!errors.description}
                      disabled={isPending}
                      rows={4}
                    />
                  </FormField>
                </div>
              </div>
              {/* Amenities */}
              <div className="bg-white rounded-2xl shadow-lg border border-white/20 p-6">
                <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white font-bold mr-2">2</span>
                  Property Extra's
                </h2>
                <FormField label="Amenities">
                  <AmenitiesSelector
                    availableOptions={availableAmenities}
                    selectedAmenities={formData.amenities}
                    onAmenitiesChange={handleAmenitiesChange}
                    error={errors.amenities}
                  />
                </FormField>
              </div>
              {/* Images */}
              <div className="bg-white rounded-2xl shadow-lg border border-white/20 p-6">
                <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white font-bold mr-2">3</span>
                  Property Images
                </h2>
                <ImageUpload
                  imageURLs={formData.imageURL}
                  imageFiles={formData.imageFiles}
                  onImagesChange={handleImagesChange}
                  error={errors.images}
                />
              </div>
            </div>
            {/* Sidebar - Right Side */}
            <div className="space-y-6 flex flex-col justify-start">
              <div className="bg-white rounded-2xl shadow-lg border border-white/20 p-6">
                <h3 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white font-bold mr-2">4</span>
                  Actions
                </h3>
                <div className="space-y-3">
                  <button
                    type="submit"
                    className={`w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-700 text-white rounded-full shadow hover:bg-blue-800 transition-all duration-200 text-base font-bold border-none focus:ring-2 focus:ring-blue-300 disabled:opacity-60 ${isPending ? 'animate-pulse' : ''}`}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <span className="inline-block w-5 h-5 mr-2 border-2 border-white border-t-blue-500 rounded-full animate-spin"></span>
                    ) : (
                      <FaPlusCircle className="text-lg" />
                    )}
                    <span className="tracking-wide">{isPending ? "Adding..." : "Add Property"}</span>
                  </button>
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-full border border-gray-300 shadow-sm hover:bg-gray-200 transition-all duration-200 text-base font-bold focus:ring-2 focus:ring-gray-300 disabled:opacity-60"
                    onClick={resetForm}
                    disabled={isPending}
                  >
                    <span className="tracking-wide">Reset Form</span>
                  </button>
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-700 rounded-full border border-red-400 shadow-sm hover:bg-red-100 transition-all duration-200 text-base font-bold focus:ring-2 focus:ring-red-300 disabled:opacity-60"
                    onClick={() => navigate(`/dashboard/${userId}/properties`)}
                    disabled={isPending}
                  >
                    <FaArrowLeft className="text-lg" />
                    <span className="tracking-wide">Cancel</span>
                  </button>
                </div>
              </div>
              {/* Form Preview */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white font-bold mr-2">5</span>
                  Form Validation
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Title:</span>
                    <span className={`font-medium ${formData.title ? 'text-blue-700' : 'text-gray-400'}`}>{formData.title ? 'Filled' : 'Not filled'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Address:</span>
                    <span className={`font-medium ${formData.address ? 'text-blue-700' : 'text-gray-400'}`}>{formData.address ? 'Filled' : 'Not filled'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className={`font-medium ${formData.price ? 'text-blue-700' : 'text-gray-400'}`}>{formData.price ? 'Filled' : 'Not filled'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amenities:</span>
                    <span className={`font-medium ${formData.amenities.length > 0 ? 'text-blue-700' : 'text-gray-400'}`}>{formData.amenities.length > 0 ? `${formData.amenities.length} selected` : 'None'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Description:</span>
                    <span className={`font-medium ${formData.description ? 'text-blue-700' : 'text-gray-400'}`}>{formData.description ? 'Filled' : 'Not filled'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Images:</span>
                    <span className={`font-medium ${formData.imageURL.length > 0 ? 'text-blue-700' : 'text-gray-400'}`}>{formData.imageURL.length > 0 ? `${formData.imageURL.length} uploaded` : 'None'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </TabWrapper>
  );
}
