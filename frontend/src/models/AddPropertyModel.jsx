import { useEffect, useCallback, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { availableAmenities } from "../constants/amenities.js";
import { 
  ModalContainer, 
  ModalHeader, 
  ModalForm, 
  ModalButtons, 
  ModalFormField,
  AmenitiesSelector,
  ImageUpload
} from "../components/modals/index.js";

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
  const [errors, setErrors] = useState({});

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
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.price || formData.price <= 0) newErrors.price = "Valid price is required";
    if (formData.imageFiles.length === 0) newErrors.images = "At least one image is required";
    if (!formData.amenities || formData.amenities.length === 0) newErrors.amenities = "At least one amenity must be selected";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Clear any existing errors and submit
    setErrors({});
    onSubmit(e);
  };

  // Handle close action
  const handleClose = () => {
    onClose();
  };

  return (
    <ModalContainer 
      show={show} 
      onClose={handleClose} 
      size="md" 
      maxHeight="compact"
    >
      <ModalHeader
        title="Add New Property"
        onClose={handleClose}
        icon={FaPlusCircle}
      />
      
      <ModalForm onSubmit={handleSubmit} scrollable={true} className="gap-3">
        {/* Single Column Layout for Compact Design */}
        <ModalFormField
          label="Property Title"
          name="title"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          placeholder="e.g., Modern 2BR Apartment"
          error={errors.title}
          required
        />
        
        <ModalFormField
          label="Monthly Rent (R)"
          name="price"
          type="number"
          value={formData.price}
          onChange={(e) => handleInputChange("price", e.target.value)}
          placeholder="e.g., 12000"
          error={errors.price}
          required
        />

        <ModalFormField
          label="Property Address"
          name="address"
          value={formData.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
          placeholder="e.g., 123 Main Street, Johannesburg"
          error={errors.address}
          required
        />

        <ModalFormField
          label="Property Description"
          name="description"
          type="textarea"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Brief description..."
          error={errors.description}
          required
          rows={1}
        />

        {/* Amenities Selection - Using Reusable Component */}
        <AmenitiesSelector
          availableOptions={availableAmenities}
          selectedAmenities={formData.amenities}
          onAmenitiesChange={handleAmenitiesChange}
          error={errors.amenities}
          required
        />

        {/* Image Upload - Using Reusable Component */}
        <ImageUpload
          imageURLs={formData.imageURL}
          imageFiles={formData.imageFiles}
          onImagesChange={handleImagesChange}
          error={errors.images}
          required
        />
      </ModalForm>
      
      <ModalButtons
        primaryAction={{
          label: "Add Property",
          icon: FaPlusCircle,
          type: "submit",
          onClick: handleSubmit
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: handleClose
        }}
        isPending={isPending}
      />
    </ModalContainer>
  );
}