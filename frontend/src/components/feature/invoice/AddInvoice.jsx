import { useCallback, useState, useEffect, useRef } from "react";
import { FaPlusCircle, FaChevronDown } from "react-icons/fa";
import { 
  TabWrapper,
  FormField,
  FormInput,
  FormLayout,
  FormSection,
  FormValidationPreview,
  FormButtonGroup
} from "../../common/index.js";
import InvoicePreview from "./InvoicePreview.jsx";
import {
  useCreateInvoiceMutation,
  useLeasesQuery,
} from "../../../utils/queries.js";
import { useParams, useNavigate } from "react-router-dom";

export default function AddInvoice() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [formData, setFormData] = useState({
    amount: "",
    date: "",
    leaseId: "",
  });

  // Fetch leases for the dropdown
  const { data: leases = [], isLoading: leasesLoading } =
    useLeasesQuery(userId);
  const createInvoiceMutation = useCreateInvoiceMutation();
  const isPending = createInvoiceMutation.isPending;

  // Debug: Log leases when they load
  useEffect(() => {
    if (leases.length > 0) {
      console.log("Leases loaded:", leases);
      console.log("First lease structure:", leases[0]);
    }
  }, [leases]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Reset form function
  const resetForm = useCallback(() => {
    setFormData({
      amount: "",
      date: "",
      leaseId: "",
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

    if (!formData.amount || formData.amount <= 0)
      newErrors.amount = "Valid amount is required";
    if (!formData.date) newErrors.date = "Due date is required";
    if (!formData.leaseId) newErrors.leaseId = "Please select a lease";

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
    console.log("Form data being sent:", formData);
    console.log("Selected lease:", selectedLease);
    createInvoiceMutation.mutate(formData, {
      onSuccess: () => {
        resetForm();
        navigate(`/dashboard/${userId}/invoices`);
      },
    });
  };

  // Get selected lease details for preview
  const selectedLease = leases.find((lease) => lease.leaseId === formData.leaseId);

  // Validation items for preview
  const validationItems = [
    { label: "Lease Selected", isValid: !!formData.leaseId },
    { label: "Amount", isValid: !!formData.amount },
    { label: "Due Date", isValid: !!formData.date },
  ];

  const overallStatus = {
    isComplete: formData.leaseId && formData.amount && formData.date,
    text: (formData.leaseId && formData.amount && formData.date) ? "Ready" : "Incomplete"
  };

  return (
    <TabWrapper decorativeElements="blue-purple">
      <FormLayout
        title="Add a New Invoice"
        backButtonText="Back to Invoices"
        backButtonAction={() => navigate(-1)}
        maxWidth="max-w-6xl"
        formProps={{ onSubmit: handleSubmit }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-8">
            {/* Invoice Information */}
            <FormSection
              title="Invoice Details"
              stepNumber={1}
            >
              <div className="space-y-6">
                <FormField label="Select Lease" error={errors.leaseId}>
                  <div className="relative" ref={dropdownRef}>
                      <button
                        type="button"
                        className={`w-full px-3 py-2.5 border rounded-xl outline-none shadow-sm transition text-sm flex items-center justify-between ${
                          errors.leaseId
                            ? "border-[#FF3B30] focus:ring-2 focus:ring-[#FF3B30]"
                            : "border-gray-300 focus:ring-2 focus:ring-blue-700"
                        }`}
                        onClick={() => setDropdownOpen((open) => !open)}
                        disabled={isPending || leasesLoading}
                      >
                        <span className={selectedLease ? "text-gray-900" : "text-gray-400"}>
                          {leasesLoading
                            ? "Loading leases..."
                            : selectedLease
                            ? `${selectedLease.leaseId || "Undefined Lease"} - ${selectedLease.tenant?.firstName} ${selectedLease.tenant?.surname || "Unknown Tenant"} (${selectedLease.status})`
                            : "Select a lease"}
                        </span>
                        <FaChevronDown
                          className={`ml-2 transition-transform duration-200 ${
                            dropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {dropdownOpen && (
                        <div className="absolute left-0 right-0 z-20 mt-1 bg-white border border-blue-200 rounded-xl shadow-lg max-h-60 overflow-y-auto animate-fade-in">
                          {leases.length === 0 ? (
                            <div className="px-4 py-3 text-gray-500 text-center">
                              No leases available
                            </div>
                          ) : (
                            leases.map((lease) => (
                              <button
                                type="button"
                                key={lease._id}
                                className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors font-medium border-b border-gray-100 last:border-0 ${
                                  formData.leaseId === lease.leaseId ? "bg-blue-100" : ""
                                }`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  console.log("Selected lease object:", lease);
                                  console.log("Lease ID being set:", lease.leaseId);
                                  handleInputChange("leaseId", lease.leaseId);
                                  setDropdownOpen(false);
                                }}
                              >
                                <div className="font-semibold text-blue-800">
                                  Lease ID: {lease.leaseId || "Undefined"}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                  Tenant: {lease.tenant?.firstName} {lease.tenant?.surname || "Unknown Tenant"}
                                </div>
                                <div className="text-sm text-gray-600">
                                  Property: {lease.listing?.title || lease.listing?.address || "N/A"}
                                </div>
                                <div className="text-xs text-blue-600 font-semibold mt-1">
                                  Status: {lease.status}
                                </div>
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </FormField>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Invoice Amount" error={errors.amount}>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                          R
                        </span>
                        <FormInput
                          type="number"
                          name="amount"
                          value={formData.amount}
                          onChange={(e) =>
                            handleInputChange("amount", e.target.value)
                          }
                          className="pl-8 pr-4"
                          placeholder="0.00"
                          hasError={!!errors.amount}
                          disabled={isPending}
                          step="0.01"
                          min="0"
                        />
                      </div>
                    </FormField>

                    <FormField label="Due Date" error={errors.date}>
                      <FormInput
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={(e) =>
                          handleInputChange("date", e.target.value)
                        }
                        hasError={!!errors.date}
                        disabled={isPending}
                      />
                    </FormField>
                  </div>
                </div>
            </FormSection>

            {/* Invoice Preview */}
            <FormSection
              title="Invoice Preview"
              stepNumber={2}
            >
              <InvoicePreview
                selectedLease={selectedLease}
                formData={formData}
              />
            </FormSection>
          </div>
          
          {/* Sidebar - Right Side */}
          <div className="space-y-6 flex flex-col justify-start">
            {/* Action Buttons */}
            <FormSection
              title="Actions"
              stepNumber={3}
            >
              <FormButtonGroup
                submitText="Create Invoice"
                submitLoadingText="Creating..."
                isSubmitting={isPending}
                submitIcon={<FaPlusCircle className="text-lg" />}
                showReset={true}
                onReset={resetForm}
                showCancel={true}
                onCancel={() => navigate(`/dashboard/${userId}/invoices`)}
                cancelText="Cancel"
                errors={errors}
              />
            </FormSection>

            {/* Form Preview */}
            <FormValidationPreview
              title="Form Validation"
              stepNumber={4}
              validationItems={validationItems}
              overallStatus={overallStatus}
            />
          </div>
        </div>
      </FormLayout>
    </TabWrapper>
  );
}
