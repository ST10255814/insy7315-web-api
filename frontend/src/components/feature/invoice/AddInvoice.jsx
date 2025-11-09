import { useCallback, useState, useEffect, useRef } from "react";
import { FaPlusCircle, FaArrowLeft, FaChevronDown } from "react-icons/fa";
import TabWrapper from "../../common/TabWrapper.jsx";
import FormField from "../../common/FormField.jsx";
import FormInput from "../../common/FormInput.jsx";
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

  return (
    <TabWrapper decorativeElements="blue-purple">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft /> Back to Invoices
          </button>
          <h1 className="text-3xl font-bold text-blue-700 flex items-center gap-2">
            Add a New Invoice
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Left Side */}
            <div className="lg:col-span-2 space-y-8">
              {/* Invoice Information */}
              <div className="bg-white rounded-2xl shadow-lg border border-white/20 p-6">
                <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white font-bold mr-2">
                    1
                  </span>
                  Invoice Details
                </h2>
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
              </div>

              {/* Invoice Preview */}
                <div className="bg-white rounded-2xl shadow-lg border border-white/20 p-6">
                  <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white font-bold mr-2">
                      2
                    </span>
                    Invoice Preview
                  </h2>
                  <InvoicePreview
                    selectedLease={selectedLease}
                    formData={formData}
                  />
              </div>
            </div>
            {/* Sidebar - Right Side */}
            <div className="space-y-6 flex flex-col justify-start">
              <div className="bg-white rounded-2xl shadow-lg border border-white/20 p-6">
                <h3 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white font-bold mr-2">
                    3
                  </span>
                  Actions
                </h3>
                <div className="space-y-3">
                  <button
                    type="submit"
                    className={`w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-700 text-white rounded-full shadow hover:bg-blue-800 transition-all duration-200 text-base font-bold border-none focus:ring-2 focus:ring-blue-300 disabled:opacity-60 ${
                      isPending ? "animate-pulse" : ""
                    }`}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <span className="inline-block w-5 h-5 mr-2 border-2 border-white border-t-blue-500 rounded-full animate-spin"></span>
                    ) : (
                      <FaPlusCircle className="text-lg" />
                    )}
                    <span className="tracking-wide">
                      {isPending ? "Creating..." : "Create Invoice"}
                    </span>
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
                    onClick={() => navigate(`/dashboard/${userId}/invoices`)}
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
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white font-bold mr-2">
                    4
                  </span>
                  Form Validation
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lease Selected:</span>
                    <span
                      className={`font-medium ${
                        formData.leaseId ? "text-blue-700" : "text-gray-400"
                      }`}
                    >
                      {formData.leaseId ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span
                      className={`font-medium ${
                        formData.amount ? "text-blue-700" : "text-gray-400"
                      }`}
                    >
                      {formData.amount
                        ? `R ${parseFloat(formData.amount).toFixed(2)}`
                        : "Not filled"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Due Date:</span>
                    <span
                      className={`font-medium ${
                        formData.date ? "text-blue-700" : "text-gray-400"
                      }`}
                    >
                      {formData.date
                        ? new Date(formData.date).toLocaleDateString()
                        : "Not filled"}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-semibold">
                        Form Status:
                      </span>
                      <span
                        className={`font-bold ${
                          formData.leaseId && formData.amount && formData.date
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {formData.leaseId && formData.amount && formData.date
                          ? "Ready"
                          : "Incomplete"}
                      </span>
                    </div>
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
