import { FaArrowLeft } from "react-icons/fa";
import { DataStateHandler, DataLoading } from "../../common/index.js";
import { TabWrapper } from "../../common";
import { useNavigate, useParams } from "react-router-dom";
import BookingPreview from "./BookingPreview.jsx";
import { useBookingByIdQuery } from "../../../utils/queries.js";

export default function ViewBooking() {
  const { bookingID, userId: adminId } = useParams();
  const { isLoading, isError, data: booking } = useBookingByIdQuery(adminId, bookingID);

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
          data={booking}
          errorMessage="Failed to load booking details. Please try again."
          emptyMessage="Booking not found."
          loadingComponent={DataLoading}
        >
          {booking && (
            <BookingPreview booking={booking} />
          )}
        </DataStateHandler>
      </div>
    </TabWrapper>
  );
}
