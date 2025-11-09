import { useEffect, useCallback, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { availableAmenities } from "../../../constants/amenities.js";
import { AmenitiesSelector, ImageUpload } from "../../modals/index.js";
import { 
  TabWrapper,
  FormField,
  FormInput,
  FormLayout,
  FormSection,
  FormValidationPreview,
  FormButtonGroup
} from "../../common/index.js";
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
    setFormData((prev) => {
      prev.imageURL.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
      return {
        title: "",
        address: "",
        description: "",
        amenities: [],
        imageURL: [],
        imageFiles: [],
        price: "",
      };
    });
    setErrors({});
  }, []);

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
    setFormData((prev) => ({ ...prev, [field]: value }));
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
    setFormData((prev) => ({
      ...prev,
      imageFiles: files,
      imageURL: urls,
    }));

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
    createListingMutation.mutate(formData, {
      onSuccess: () => {
        resetForm();
        navigate(`/dashboard/${userId}/properties`);
      },
    });
  };

  // Validation items for preview
  const validationItems = [
    { label: "Title", isValid: !!formData.title },
    { label: "Address", isValid: !!formData.address },
    { label: "Price", isValid: !!formData.price },
    { label: "Description", isValid: !!formData.description },
    { label: "Amenities", isValid: formData.amenities.length > 0 },
    { label: "Images", isValid: formData.imageURL.length > 0 },
  ];

  const overallStatus = {
    isComplete: formData.title && formData.address && formData.price && formData.description && formData.amenities.length > 0 && formData.imageURL.length > 0,
    text: (formData.title && formData.address && formData.price && formData.description && formData.amenities.length > 0 && formData.imageURL.length > 0) ? "Ready" : "Incomplete"
  };

  return (
    <TabWrapper decorativeElements="default">
      <FormLayout
        title="Add a New Property"
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
            </FormSection>

            {/* Amenities */}
            <FormSection
              title="Property Extra's"
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
            {/* Action Buttons */}
            <FormSection
              title="Actions"
              stepNumber={4}
            >
              <FormButtonGroup
                submitText="Add Property"
                submitLoadingText="Adding..."
                isSubmitting={isPending}
                submitIcon={<FaPlusCircle className="text-lg" />}
                showReset={true}
                onReset={resetForm}
                showCancel={true}
                onCancel={() => navigate(`/dashboard/${userId}/properties`)}
                cancelText="Cancel"
                errors={errors}
              />
            </FormSection>
            {/* Form Preview */}
            <FormValidationPreview
              title="Form Validation"
              stepNumber={5}
              validationItems={validationItems}
              overallStatus={overallStatus}
            />
          </div>
        </div>
      </FormLayout>
    </TabWrapper>
  );
}
