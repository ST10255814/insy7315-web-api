import { useState } from "react";

/**
 * Custom hook for form validation and state management
 * 
 * @param {Object} initialState - Initial form data
 * @param {Object} validationRules - Validation rules for each field
 * @returns {Object} Form utilities and state
 */
export function useFormValidation(initialState = {}, validationRules = {}) {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle input changes and clear errors
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    // Clear error for this field if user is typing
    if (errors[name] && fieldValue) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  /**
   * Validate all fields based on validation rules
   */
  const validateForm = () => {
    const newErrors = {};

    Object.keys(validationRules).forEach((field) => {
      const value = formData[field];
      const rules = validationRules[field];

      if (rules.required && (!value || value.toString().trim() === "")) {
        newErrors[field] = rules.requiredMessage || `${field} is required`;
      } else if (value && rules.validator && !rules.validator(value)) {
        newErrors[field] = rules.validatorMessage || `Invalid ${field}`;
      } else if (value && rules.minLength && value.toString().length < rules.minLength) {
        newErrors[field] = rules.minLengthMessage || `${field} must be at least ${rules.minLength} characters`;
      } else if (value && rules.maxLength && value.toString().length > rules.maxLength) {
        newErrors[field] = rules.maxLengthMessage || `${field} must be no more than ${rules.maxLength} characters`;
      } else if (value && rules.min && Number(value) < rules.min) {
        newErrors[field] = rules.minMessage || `${field} must be at least ${rules.min}`;
      } else if (value && rules.max && Number(value) > rules.max) {
        newErrors[field] = rules.maxMessage || `${field} must be no more than ${rules.max}`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    setFormData(initialState);
    setErrors({});
    setIsSubmitting(false);
  };

  /**
   * Set a specific error
   */
  const setFieldError = (field, message) => {
    setErrors((prev) => ({
      ...prev,
      [field]: message,
    }));
  };

  /**
   * Clear a specific error
   */
  const clearFieldError = (field) => {
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  /**
   * Set multiple form values at once
   */
  const setFormValues = (values) => {
    setFormData((prev) => ({
      ...prev,
      ...values,
    }));
  };

  return {
    formData,
    errors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    validateForm,
    resetForm,
    setFieldError,
    clearFieldError,
    setFormValues,
    setFormData,
    setErrors,
  };
}

/**
 * Common validation functions
 */
export const validators = {
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  password: (value) => value && value.length >= 8,
  positiveNumber: (value) => !isNaN(value) && Number(value) > 0,
  requiredString: (value) => value && value.toString().trim().length > 0,
  username: (value) => /^[a-zA-Z0-9_]{3,20}$/.test(value),
  phoneNumber: (value) => /^[+]?[0-9\s\-()]{10,}$/.test(value),
};