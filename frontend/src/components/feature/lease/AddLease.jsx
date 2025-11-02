import { useState, useCallback, useEffect, useRef } from "react";
import { TabWrapper } from "../../common";
import { FaPlusCircle, FaArrowLeft, FaChevronDown } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { useBookingsQuery, useCreateLeaseMutation } from "../../../utils/queries.js";
import Toast from "../../../lib/toast.js";
import FormField from "../../common/FormField.jsx";
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

  return (
    <TabWrapper decorativeElements="default">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft /> Back to Leases
          </button>
          <h1 className="text-3xl font-bold text-blue-700 flex items-center gap-2">
            Create a New Lease
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Left Side */}
            <div className="lg:col-span-2 space-y-8">
              {/* Booking Selection */}
              <div className="bg-white rounded-2xl shadow-lg border border-white/20 p-6">
                <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white font-bold mr-2">
                    1
                  </span>
                  Select Booking
                </h2>
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
              </div>

              {/* Booking Preview */}
              <BookingPreview booking={selectedBooking} />
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
                      isSubmitting ? "animate-pulse" : ""
                    }`}
                    disabled={isSubmitting || !selectedBookingId}
                  >
                    {isSubmitting ? (
                      <span className="inline-block w-5 h-5 mr-2 border-2 border-white border-t-blue-500 rounded-full animate-spin"></span>
                    ) : (
                      <FaPlusCircle className="text-lg" />
                    )}
                    <span className="tracking-wide">
                      {isSubmitting ? "Creating..." : "Create Lease"}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-full border border-gray-300 shadow-sm hover:bg-gray-200 transition-all duration-200 text-base font-bold focus:ring-2 focus:ring-gray-300 disabled:opacity-60"
                    onClick={resetForm}
                    disabled={isSubmitting}
                  >
                    <span className="tracking-wide">Reset Form</span>
                  </button>
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-700 rounded-full border border-red-400 shadow-sm hover:bg-red-100 transition-all duration-200 text-base font-bold focus:ring-2 focus:ring-red-300 disabled:opacity-60"
                    onClick={() => navigate(`/dashboard/${userId}/leases`)}
                    disabled={isSubmitting}
                  >
                    <FaArrowLeft className="text-lg" />
                    <span className="tracking-wide">Cancel</span>
                  </button>
                </div>
              </div>

              {/* Form Status */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white font-bold mr-2">
                    4
                  </span>
                  Form Status
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking Selected:</span>
                    <span
                      className={`font-medium ${
                        selectedBookingId ? "text-blue-700" : "text-gray-400"
                      }`}
                    >
                      {selectedBookingId ? "Yes" : "No"}
                    </span>
                  </div>
                  {selectedBooking && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tenant:</span>
                        <span className="font-medium text-blue-700">
                          {selectedBooking.tenantInfo?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Property:</span>
                        <span className="font-medium text-blue-700 text-right max-w-[150px] truncate">
                          {selectedBooking.listingTitle}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-semibold">
                        Form Status:
                      </span>
                      <span
                        className={`font-bold ${
                          selectedBookingId
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {selectedBookingId ? "Ready" : "Incomplete"}
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
