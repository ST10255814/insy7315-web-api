import { FaArrowLeft } from "react-icons/fa";
import { DataStateHandler, DataLoading } from "../../common/index.js";
import { TabWrapper } from "../../common";
import { useNavigate } from "react-router-dom";
import BookingPreview from "./BookingPreview.jsx";

export default function ViewBooking() {
  //TODO: Fetch booking and lease data here
  const isLoading = false;
  const isError = false;
  const mockBooking = {
    bookingId: "B-2025-001",
    tenantName: "Gerhard Lemmer",
    propertyName: "Sunset Villas, Unit 12",
    startDate: "2025-11-15T14:00:00Z",
    endDate: "2026-11-14T10:00:00Z",
    amount: 12500,
    status: "Confirmed", // Try "Cancelled" or "Pending" for other badge colors
    notes: "Tenant requested early check-in. Please confirm with caretaker.",
    createdAt: "2025-11-01T09:30:00Z",
    updatedAt: "2025-11-10T16:45:00Z",
  };

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <TabWrapper decorativeElements="default">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow hover:from-blue-600 hover:to-blue-700 hover:scale-105 hover:shadow-lg transition-all duration-500 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
          >
            <FaArrowLeft className="w-5 h-5" />
            Back to Invoices
          </button>
        </div>

        <DataStateHandler
          isLoading={isLoading}
          isError={isError}
          data={mockBooking}
          errorMessage="Failed to load booking details. Please try again."
          emptyMessage="Booking not found."
          loadingComponent={DataLoading}
        >
          {mockBooking && (
            <BookingPreview booking={mockBooking} />
          )}
        </DataStateHandler>
      </div>
    </TabWrapper>
  );
}
