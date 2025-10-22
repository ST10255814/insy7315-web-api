import { motion, AnimatePresence } from "framer-motion";
import Toast from "../lib/toast.js";
import LoadingSkeleton from "../pages/LoadingSkeleton.jsx";
import BookingCard from "../pages/BookingCard.jsx";
import { useBookingsQuery } from "../utils/queries.js";
import { useParams } from "react-router-dom";

export default function BookingsTab() {
  const { userId: adminId } = useParams();
  const { isLoading, isError, data: bookings = [] } = useBookingsQuery(adminId);

  const handleBookingAction = (action, booking) => {
    switch (action) {
      case "Edit":
        Toast.info(`Editing booking ${booking.bookingId}`);
        break;
      case "Delete":
        Toast.warning(`Deleting booking ${booking.bookingId}`);
        break;
      case "View":
        Toast.info(`Viewing details for ${booking.bookingId}`);
        break;
      case "Confirm":
        Toast.success(`Confirmed booking ${booking.bookingId}`);
        break;
      case "Cancel":
        Toast.warning(`Cancelled booking ${booking.bookingId}`);
        break;
      default:
        break;
    }
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto space-y-6 p-2 sm:p-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Booking Cards / Loading / Error */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <LoadingSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && (
        <div className="text-red-600 font-semibold text-center mt-10">
          Failed to load bookings. Please try again.
        </div>
      )}

      {!isLoading && !isError && bookings.length === 0 && (
        <div className="text-gray-500 text-center mt-10 font-medium">
          No bookings found. Add a new booking to get started.
        </div>
      )}

      {!isLoading && bookings.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {bookings.map((booking) => (
              <BookingCard
                key={booking.bookingId}
                booking={booking}
                onAction={handleBookingAction}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
