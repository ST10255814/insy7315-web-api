import { useEffect, useState } from "react";
import { FaSave, FaArrowLeft, FaTimes } from "react-icons/fa";
import { availableAmenities } from "../../../constants/amenities.js";
import { AmenitiesSelector, ImageUpload } from "../../modals/index.js";
import { FormField, FormInput, PropertyStateHandler, TabWrapper } from "../../common/index.js";
import { useListingByIdQuery } from "../../../utils/queries.js";
// import { useEditListingMutation } from "../../../utils/queries.js";
import { useParams, useNavigate } from "react-router-dom";

export default function EditProperty() {
  const { userId, propertyId } = useParams();
  const navigate = useNavigate();
  const { data: property, isLoading, isError } = useListingByIdQuery(userId, propertyId);
  // TODO: Replace with your mutation hook
  // const editListingMutation = useEditListingMutation();
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: "",
    address: "",
    description: "",
    amenities: [],
    imageURL: [],
    imageFiles: [],
    price: "",
    status: "Available",
  });
  const [isPending, setIsPending] = useState(false); // Replace with mutation.isPending
  const [isDirty, setIsDirty] = useState(false);
  const statusOptions = ["Vacant", "Occupied", "Under Maintenance", "Reserved"];

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || "",
        address: property.address || "",
        description: property.description || "",
        amenities: property.amenities || [],
        imageURL: property.imagesURL || [],
        imageFiles: [],
        price: property.price || "",
        status: property.status || "Available",
      });
      setIsDirty(false);
    }
  }, [property]);

  useEffect(() => {
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
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      setIsDirty(
        updated.title !== (property.title || "") ||
          updated.address !== (property.address || "") ||
          updated.description !== (property.description || "") ||
          updated.price !== (property.price || "") ||
          updated.status !== (property.status || "") ||
          JSON.stringify(updated.amenities) !==
            JSON.stringify(property.amenities || [])
      );
      return updated;
    });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  // Reset form to original property data
  const handleReset = () => {
    if (property) {
      setFormData({
        title: property.title || "",
        address: property.address || "",
        description: property.description || "",
        amenities: property.amenities || [],
        imageURL: property.imageURL || [],
        imageFiles: [],
        price: property.price || "",
        status: property.status || "Available",
      });
      setIsDirty(false);
      setErrors({});
    }
  };

  // Handle amenities change
  const handleAmenitiesChange = (selectedAmenities, error) => {
    handleInputChange("amenities", selectedAmenities);
    if (error) {
      setErrors({ ...errors, amenities: error });
    } else if (errors.amenities) {
      setErrors({ ...errors, amenities: "" });
    }
  };

  // Handle images change
  const handleImagesChange = (files, urls, error) => {
    setFormData((prev) => {
      const updated = { ...prev, imageFiles: files, imageURL: urls };
      setIsDirty(
        JSON.stringify(updated.imageURL) !==
          JSON.stringify(property.imageURL || [])
      );
      return updated;
    });
    setErrors((prev) => ({
      ...prev,
      images: error || "",
    }));
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
    if (formData.imageFiles.length === 0 && formData.imageURL.length === 0)
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
    setIsPending(true); // Replace with mutation
    // TODO: Insert your mutation logic here
    // editListingMutation.mutate({ ...formData, propertyId }, {
    //   onSuccess: () => {
    //     resetForm();
    //     navigate(`/dashboard/${userId}/properties`);
    //   },
    // });
    setTimeout(() => {
      setIsPending(false);
      navigate(`/dashboard/${userId}/properties`);
    }, 1500);
  };

  return (
      <TabWrapper decorativeElements="default">
        <PropertyStateHandler
          isLoading={isLoading}
          isError={isError}
          property={property}
          errorMessage="Failed to load property. Please try again."
          emptyMessage="Property not found."
        >
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => navigate(`/dashboard/${userId}/properties`)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow hover:from-blue-600 hover:to-blue-700 hover:scale-105 hover:shadow-lg transition-all duration-500 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
              >
                <FaArrowLeft className="w-5 h-5" />
                Back to Properties
              </button>
              <div>
                <h1 className="text-3xl font-bold text-blue-700 flex items-center gap-2">
                  Edit Property
                </h1>
                <p className="text-base text-gray-600 mt-1">
                  Edit the details of property{" "}
                  <span className="font-semibold text-blue-700">
                    {property?.listingId}
                  </span>{" "}
                  below.
                </p>
              </div>
              <div className="flex-shrink-0 md:ml-auto">
                <button
                  onClick={() => navigate(`/dashboard/${userId}/properties/view/${propertyId}`)}
                  className="px-4 py-2 rounded-lg border border-blue-500 text-blue-600 font-medium bg-white shadow hover:bg-blue-50 hover:text-blue-700 hover:scale-105 hover:shadow-lg transition-all duration-500 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                >
                  View Property {property?.listingId}
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content - Left Side */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Basic Information */}
                  <div className="bg-white rounded-2xl shadow-lg border border-white/20 p-6">
                    <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white font-bold mr-2">
                        1
                      </span>
                      Edit Basic Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField label="Property Title" error={errors.title}>
                        <FormInput
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={(e) =>
                            handleInputChange("title", e.target.value)
                          }
                          placeholder="e.g., Modern 2BR Apartment"
                          hasError={!!errors.title}
                          disabled={isPending}
                        />
                      </FormField>
                      <FormField label="Monthly Rent" error={errors.price}>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            R
                          </span>
                          <FormInput
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={(e) =>
                              handleInputChange("price", e.target.value)
                            }
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
                          onChange={(e) =>
                            handleInputChange("address", e.target.value)
                          }
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
                          onChange={(e) =>
                            handleInputChange("description", e.target.value)
                          }
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
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white font-bold mr-2">
                        2
                      </span>
                      Edit Property Amenities
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
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white font-bold mr-2">
                        3
                      </span>
                      Edit Property Images
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
                  {/* Status Field Above Actions - Radio Buttons */}
                  <div className="bg-white rounded-2xl shadow-lg border border-white/20 p-6">
                    <h3 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white font-bold mr-2">
                        4
                      </span>
                      Edit Property Status
                    </h3>
                    <FormField label="Edit Status">
                      <div className="space-y-2">
                        {statusOptions.map((status) => (
                          <label
                            key={status}
                            className={`flex items-center p-2 rounded-lg border cursor-pointer transition-all ${
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
                              onChange={() => handleInputChange("status", status)}
                              className="mr-3"
                              disabled={isPending}
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
                    </FormField>
                  </div>
                  {/* Actions */}
                  <div className="bg-white rounded-2xl shadow-lg border border-white/20 p-6">
                    <h3 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white font-bold mr-2">
                        5
                      </span>
                      Edit Actions
                    </h3>
                    <div className="space-y-3">
                      <button
                        type="submit"
                        className={`w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-700 text-white rounded-full shadow hover:bg-blue-800 transition-all duration-200 text-base font-bold border-none focus:ring-2 focus:ring-blue-300 disabled:opacity-60  ${
                          isPending ? "animate-pulse" : ""
                        }`}
                        disabled={isPending || !isDirty}
                      >
                        {isPending ? (
                          <span className="inline-block w-5 h-5 mr-2 border-2 border-white border-t-blue-500 rounded-full animate-spin"></span>
                        ) : (
                          <FaSave className="text-lg" />
                        )}
                        <span className="tracking-wide">
                          {isPending ? "Saving..." : "Save Changes"}
                        </span>
                      </button>
                      {isDirty && (
                        <button
                        type="button"
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-full border border-gray-300 shadow-sm hover:bg-gray-200 transition-all duration-200 text-base font-bold focus:ring-2 focus:ring-gray-300 disabled:opacity-60"
                        onClick={handleReset}
                      >
                        <span className="tracking-wide">Reset Form</span>
                      </button>
                      )}
                      <button
                        type="button"
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-700 rounded-full border border-red-400 shadow-sm hover:bg-red-100 transition-all duration-200 text-base font-bold focus:ring-2 focus:ring-red-300 disabled:opacity-60"
                        onClick={() => navigate(`/dashboard/${userId}/properties`)}
                        disabled={isPending}
                      >
                        <FaTimes className="text-lg" />
                        <span className="tracking-wide">Cancel</span>
                      </button>
                    </div>
                  </div>
                  {/* Property Preview  */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white font-bold mr-2">
                        6
                      </span>
                      Current Property Preview
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Title:</span>
                        <span className="font-medium text-blue-700">
                          {formData.title || (
                            <span className="text-gray-400">(empty)</span>
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Address:</span>
                        <span className="font-medium text-blue-700">
                          {formData.address || (
                            <span className="text-gray-400">(empty)</span>
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-medium text-blue-700">
                          {formData.status || (
                            <span className="text-gray-400">(empty)</span>
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-medium text-blue-700">
                          {formData.price ? (
                            `R ${formData.price}`
                          ) : (
                            <span className="text-gray-400">(empty)</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </PropertyStateHandler>
      </TabWrapper>
  );
}
