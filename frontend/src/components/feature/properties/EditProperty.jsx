import { useEffect, useState, useCallback } from "react";
import { FaSave } from "react-icons/fa";
import { availableAmenities } from "../../../constants/amenities.js";
import { AmenitiesSelector, ImageUpload } from "../../modals/index.js";
import {
  FormField,
  FormInput,
  DataStateHandler,
  TabWrapper,
  PropertyLoadingSkeleton,
  FormLayout,
  FormSection,
  FormButtonGroup
} from "../../common/index.js";
import { useListingByIdQuery, useUpdateListingMutation } from "../../../utils/queries.js";
// import { useEditListingMutation } from "../../../utils/queries.js";
import { useParams, useNavigate } from "react-router-dom";

export default function EditProperty() {
  const { userId, propertyId } = useParams();
  const navigate = useNavigate();
  const {
    data: property,
    isLoading,
    isError,
  } = useListingByIdQuery(userId, propertyId);

  const updateListingMutation = useUpdateListingMutation();
  
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
  const [isDirty, setIsDirty] = useState(false);
  const statusOptions = ["Vacant", "Occupied", "Under Maintenance", "Reserved"];

  // Reset form function
  const resetForm = useCallback(() => {
    if (property) {
      setFormData((prev) => {
        // Clean up blob URLs from previous state
        prev.imageURL.forEach((url) => {
          if (url.startsWith("blob:")) {
            URL.revokeObjectURL(url);
          }
        });
        return {
          title: property.title || "",
          address: property.address || "",
          description: property.description || "",
          amenities: property.amenities || [],
          imageURL: property.imagesURL || [],
          imageFiles: [],
          price: property.price || "",
          status: property.status || "Available",
        };
      });
      setIsDirty(false);
      setErrors({});
    }
  }, [property]);

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || "",
        address: property.address || "",
        description: property.description || "",
        amenities: property.amenities || [],
        imageURL: property.imagesURL || [],
        imageFiles: property.imageFiles || [],
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      console.log("Submitting form data:", formData);
      console.log("Property ID:", propertyId);
      await updateListingMutation.mutateAsync({
        listingId: propertyId,
        formData: formData,
      });
      navigate(-1);
    } catch (error) {
      // Error handling is managed in the mutation's onError callback
    }
  };

  return (
    <TabWrapper decorativeElements="default">
      <DataStateHandler
        isLoading={isLoading}
        isError={isError}
        data={property}
        loadingComponent={PropertyLoadingSkeleton}
        errorMessage="Failed to load property. Please try again."
        emptyMessage="Property not found."
      >
        <FormLayout
          title="Edit Property"
          backButtonText="Back to Properties"
          backButtonAction={() => navigate(-1)}
          maxWidth="max-w-6xl"
          formProps={{ onSubmit: handleSubmit }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Left Side */}
            <div className="lg:col-span-2 space-y-8">
              {/* Basic Information */}
              <FormSection
                title="Basic Information"
                stepNumber={1}
              >
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
                      disabled={updateListingMutation.isPending}
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
                        disabled={updateListingMutation.isPending}
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
                      disabled={updateListingMutation.isPending}
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
                      disabled={updateListingMutation.isPending}
                      rows={4}
                    />
                  </FormField>
                </div>
              </FormSection>

              {/* Amenities */}
              <FormSection
                title="Property Amenities"
                stepNumber={2}
              >
                <FormField label="Amenities">
                  <AmenitiesSelector
                    availableOptions={availableAmenities}
                    selectedAmenities={formData.amenities}
                    onAmenitiesChange={handleAmenitiesChange}
                    error={errors.amenities}
                  />
                </FormField>
              </FormSection>

              {/* Images */}
              <FormSection
                title="Property Images"
                stepNumber={3}
              >
                <ImageUpload
                  imageURLs={formData.imageURL}
                  imageFiles={formData.imageFiles}
                  onImagesChange={handleImagesChange}
                  error={errors.images}
                />
              </FormSection>
            </div>

            {/* Sidebar - Right Side */}
            <div className="space-y-6 flex flex-col justify-start">
              {/* Status Selection */}
              <FormSection
                title="Property Status"
                stepNumber={4}
              >
                <FormField label="Status">
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
                          disabled={updateListingMutation.isPending}
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
              </FormSection>

              {/* Action Buttons */}
              <FormSection
                title="Actions"
                stepNumber={5}
              >
                <FormButtonGroup
                  submitText="Save Changes"
                  submitLoadingText="Saving..."
                  isSubmitting={updateListingMutation.isPending}
                  submitIcon={<FaSave className="text-lg" />}
                  showReset={true}
                  onReset={resetForm}
                  showCancel={true}
                  onCancel={() => navigate(-1)}
                  cancelText="Cancel"
                  errors={errors}
                  disabled={!isDirty}
                />
              </FormSection>
            </div>
          </div>
        </FormLayout>
      </DataStateHandler>
    </TabWrapper>
  );
}
