import { useState, useCallback, useEffect, useRef } from "react";
import { 
  TabWrapper,
  FormField,
  FormLayout,
  FormSection,
  FormValidationPreview,
  FormButtonGroup
} from "../../common";
import { FaPlusCircle, FaChevronDown } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { useBookingsQuery, useCreateLeaseMutation } from "../../../utils/queries.js";
import Toast from "../../../lib/toast.js";
import BookingPreview from "./BookingPreview.jsx";

export default function AddLease() {
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const dropdownRef = useRef(null);
  const { userId } = useParams();
  const navigate = useNavigate();

  // Fetch bookings for dropdown
  const { data: bookings = [], isLoading: bookingsLoading } = useBookingsQuery(userId);
  const createLeaseMutation = useCreateLeaseMutation();
  const isSubmitting = createLeaseMutation.isPending;

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
    setSelectedBookingId("");
    setErrors({});
  }, []);

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!selectedBookingId) {
      newErrors.bookingId = "Please select a booking";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      Toast.error("Please select a booking");
      return;
    }

    createLeaseMutation.mutate(selectedBookingId, {
      onSuccess: () => {
        navigate(`/dashboard/${userId}/leases`);
      }
    });
  };

  const selectedBooking = bookings.find((booking) => booking.bookingID === selectedBookingId);

  // Validation items for preview
  const validationItems = [
    { label: "Booking Selected", isValid: !!selectedBookingId },
    ...(selectedBooking ? [
      { label: "Tenant", isValid: true, value: selectedBooking.tenantInfo?.name },
      { label: "Property", isValid: true, value: selectedBooking.listingTitle }
    ] : [])
  ];

  const overallStatus = {
    isComplete: !!selectedBookingId,
    text: selectedBookingId ? "Ready" : "Incomplete"
  };

  return (
    <TabWrapper decorativeElements="default">
      <FormLayout
        title="Create a New Lease"
        backButtonText="Back to Leases"
        backButtonAction={() => navigate(-1)}
        maxWidth="max-w-6xl"
        formProps={{ onSubmit: handleSubmit }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-8">
            {/* Booking Selection */}
            <FormSection
              title="Select Booking"
              stepNumber={1}
            >
              <div className="space-y-6">
                <FormField label="Select a Booking" error={errors.bookingId}>
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      className={`w-full px-3 py-2.5 border rounded-xl outline-none shadow-sm transition text-sm flex items-center justify-between ${
                        errors.bookingId
                          ? "border-[#FF3B30] focus:ring-2 focus:ring-[#FF3B30]"
                          : "border-gray-300 focus:ring-2 focus:ring-blue-700"
                      }`}
                      onClick={() => setDropdownOpen((open) => !open)}
                      disabled={bookingsLoading || isSubmitting}
                    >
                      <span className={selectedBooking ? "text-gray-900" : "text-gray-400"}>
                        {bookingsLoading
                          ? "Loading bookings..."
                          : selectedBooking
                          ? `Booking ${selectedBooking.bookingID} - ${selectedBooking.tenantInfo?.name}`
                          : "Choose a Booking"}
                      </span>
                      <FaChevronDown
                        className={`ml-2 transition-transform duration-200 ${
                          dropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {dropdownOpen && (
                      <div className="absolute left-0 right-0 z-20 mt-1 bg-white border border-blue-200 rounded-xl shadow-lg max-h-60 overflow-y-auto animate-fade-in">
                        {bookings.length === 0 ? (
                          <div className="px-4 py-3 text-gray-500 text-center">
                            No bookings available
                          </div>
                        ) : (
                          bookings.map((booking) => (
                            <button
                              type="button"
                              key={booking.bookingID}
                              className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors font-medium border-b border-gray-100 last:border-0 ${
                                selectedBookingId === booking.bookingID ? "bg-blue-100" : ""
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log("Selected booking ID:", booking.bookingID);
                                setSelectedBookingId(booking.bookingID);
                                setDropdownOpen(false);
                                if (errors.bookingId) {
                                  setErrors({});
                                }
                              }}
                            >
                              <div className="font-semibold text-blue-800">Booking ID: {booking.bookingID}</div>
                              <div className="text-sm text-gray-600 mt-1">
                                Tenant: {booking.tenantInfo?.name}
                              </div>
                              <div className="text-sm text-gray-600">
                                Property: {booking.listingTitle || booking.listingAddress}
                              </div>
                              <div className="text-xs text-blue-600 font-semibold mt-1">
                                Status: {booking.status}
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </FormField>
              </div>
            </FormSection>

            {/* Booking Preview */}
            <BookingPreview booking={selectedBooking} />
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6 flex flex-col justify-start">
            {/* Action Buttons */}
            <FormSection
              title="Actions"
              stepNumber={3}
            >
              <FormButtonGroup
                submitText="Create Lease"
                submitLoadingText="Creating..."
                isSubmitting={isSubmitting}
                submitIcon={<FaPlusCircle className="text-lg" />}
                showReset={true}
                onReset={resetForm}
                showCancel={true}
                onCancel={() => navigate(`/dashboard/${userId}/leases`)}
                cancelText="Cancel"
                errors={errors}
                disabled={!selectedBookingId}
              />
            </FormSection>

            {/* Form Status */}
            <FormValidationPreview
              title="Form Status"
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
