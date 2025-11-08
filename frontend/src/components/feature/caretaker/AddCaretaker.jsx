import { useState, useCallback } from "react";
import { FaArrowLeft, FaUserPlus } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TabWrapper, FormField, FormInput, ProfessionSelect } from "../../common/index.js";
import { professionClasses } from "../../../constants/constants.js";
import { useCreateCaretakerMutation } from "../../../utils/queries.js";

export default function AddCaretaker() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    firstname: "",
    surname: "",
    email: "",
    phoneNumber: "",
    profession: ""
  });

  // Available professions from constants
  const availableProfessions = Object.keys(professionClasses);
  const createCaretakerMutation = useCreateCaretakerMutation();

  // Reset form function
  const resetForm = useCallback(() => {
    setFormData({
      firstname: "",
      surname: "",
      email: "",
      phoneNumber: "",
      profession: ""
    });
    setErrors({});
  }, []);

  // Handle input changes and clear errors
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstname.trim()) newErrors.firstname = "First name is required";
    if (!formData.surname.trim()) newErrors.surname = "Surname is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^[+]?[0-9\s\-()]{10,}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }
    if (!formData.profession) newErrors.profession = "Profession is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setErrors({});
    createCaretakerMutation.mutate(formData, {
      onSuccess: () => {
        resetForm();
        navigate(`/dashboard/${userId}/caretakers`);
      },
    });
  };

  return (
    <TabWrapper decorativeElements="default">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft /> Back to Caretakers
          </button>
          <h1 className="text-3xl font-bold text-blue-700 flex items-center gap-3">
            <FaUserPlus />
            Add New Caretaker
          </h1>
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
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="First Name" error={errors.firstname}>
                    <FormInput
                      type="text"
                      name="firstname"
                      value={formData.firstname}
                      onChange={(e) => handleInputChange("firstname", e.target.value)}
                      placeholder="e.g., John"
                      hasError={!!errors.firstname}
                      disabled={createCaretakerMutation.isPending}
                    />
                  </FormField>
                  <FormField label="Surname" error={errors.surname}>
                    <FormInput
                      type="text"
                      name="surname"
                      value={formData.surname}
                      onChange={(e) => handleInputChange("surname", e.target.value)}
                      placeholder="e.g., Doe"
                      hasError={!!errors.surname}
                      disabled={createCaretakerMutation.isPending}
                    />
                  </FormField>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-2xl shadow-lg border border-white/20 p-6">
                <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white font-bold mr-2">
                    2
                  </span>
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Email Address" error={errors.email}>
                    <FormInput
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="e.g., john.doe@example.com"
                      hasError={!!errors.email}
                      disabled={createCaretakerMutation.isPending}
                    />
                  </FormField>
                  <FormField label="Phone Number" error={errors.phoneNumber}>
                    <FormInput
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                      placeholder="e.g., +27 82 123 4567"
                      hasError={!!errors.phoneNumber}
                      disabled={createCaretakerMutation.isPending}
                    />
                  </FormField>
                </div>
              </div>

              {/* Profession */}
              <div className="bg-white rounded-2xl shadow-lg border border-white/20 p-6">
                <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white font-bold mr-2">
                    3
                  </span>
                  Professional Information
                </h2>
                <FormField label="Profession" error={errors.profession}>
                  <ProfessionSelect
                    value={formData.profession}
                    onChange={(e) => handleInputChange("profession", e.target.value)}
                    options={availableProfessions}
                    placeholder="Select a profession"
                    hasError={!!errors.profession}
                    disabled={createCaretakerMutation.isPending}
                  />
                  {formData.profession && (
                    <div className="mt-3">
                      <span 
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          professionClasses[formData.profession] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {formData.profession}
                      </span>
                    </div>
                  )}
                </FormField>
              </div>
            </div>

            {/* Sidebar - Right Side */}
            <div className="space-y-6 flex flex-col justify-start">
              <div className="bg-white rounded-2xl shadow-lg border border-white/20 p-6">
                <h3 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white font-bold mr-2">
                    4
                  </span>
                  Actions
                </h3>
                <div className="space-y-3">
                  <button
                    type="submit"
                    className={`w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-700 text-white rounded-full shadow hover:bg-blue-800 transition-all duration-200 text-base font-bold border-none focus:ring-2 focus:ring-blue-300 disabled:opacity-60 ${
                      createCaretakerMutation.isPending ? "animate-pulse" : ""
                    }`}
                    disabled={createCaretakerMutation.isPending}
                  >
                    {createCaretakerMutation.isPending ? (
                      <span className="inline-block w-5 h-5 mr-2 border-2 border-white border-t-blue-500 rounded-full animate-spin"></span>
                    ) : (
                      <FaUserPlus className="text-lg" />
                    )}
                    <span className="tracking-wide">
                      {createCaretakerMutation.isPending ? "Adding..." : "Add Caretaker"}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-full border border-gray-300 shadow-sm hover:bg-gray-200 transition-all duration-200 text-base font-bold focus:ring-2 focus:ring-gray-300 disabled:opacity-60"
                    onClick={resetForm}
                    disabled={createCaretakerMutation.isPending}
                  >
                    <span className="tracking-wide">Reset Form</span>
                  </button>
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-700 rounded-full border border-red-400 shadow-sm hover:bg-red-100 transition-all duration-200 text-base font-bold focus:ring-2 focus:ring-red-300 disabled:opacity-60"
                    onClick={() => navigate(`/dashboard/${userId}/caretakers`)}
                    disabled={createCaretakerMutation.isPending}
                  >
                    <FaArrowLeft className="text-lg" />
                    <span className="tracking-wide">Cancel</span>
                  </button>
                </div>
              </div>

              {/* Form Preview */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white font-bold mr-2">
                    5
                  </span>
                  Form Validation
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">First Name:</span>
                    <span
                      className={`font-medium ${
                        formData.firstname ? "text-blue-700" : "text-gray-400"
                      }`}
                    >
                      {formData.firstname ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Surname:</span>
                    <span
                      className={`font-medium ${
                        formData.surname ? "text-blue-700" : "text-gray-400"
                      }`}
                    >
                      {formData.surname ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span
                      className={`font-medium ${
                        formData.email ? "text-blue-700" : "text-gray-400"
                      }`}
                    >
                      {formData.email ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span
                      className={`font-medium ${
                        formData.phoneNumber ? "text-blue-700" : "text-gray-400"
                      }`}
                    >
                      {formData.phoneNumber ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Profession:</span>
                    <span
                      className={`font-medium ${
                        formData.profession ? "text-blue-700" : "text-gray-400"
                      }`}
                    >
                      {formData.profession ? "Selected" : "None"}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-semibold">
                        Form Status:
                      </span>
                      <span
                        className={`font-bold ${
                          formData.firstname &&
                          formData.surname &&
                          formData.email &&
                          formData.phoneNumber &&
                          formData.profession
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {formData.firstname &&
                        formData.surname &&
                        formData.email &&
                        formData.phoneNumber &&
                        formData.profession
                          ? "Ready"
                          : "Incomplete"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4"
            >
              <p className="text-red-600 text-sm font-medium">{errors.submit}</p>
            </motion.div>
          )}
        </form>
      </div>
    </TabWrapper>
  );
}