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
        //TODO: Implement edit functionality
        Toast.info(`Editing booking ${booking.bookingId}`);
        break;
      case "Delete":
        //TODO: Implement delete functionality
        Toast.warning(`Deleting booking ${booking.bookingId}`);
        break;
      case "View":
        //TODO: Implement view functionality
        Toast.info(`Viewing details for ${booking.bookingId}`);
        break;
      case "Confirm":
        //TODO: Implement confirm functionality
        Toast.success(`Confirmed booking ${booking.bookingId}`);
        break;
      case "Cancel":
        //TODO: Implement cancel functionality
        Toast.warning(`Cancelled booking ${booking.bookingId}`);
        break;
      default:
        break;
    }
  };

  return (
    <motion.div
      className="w-full space-y-6 relative"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 right-1/4 w-32 h-32 bg-gradient-to-br from-blue-100/30 to-green-100/20 rounded-full blur-3xl -z-10 animate-float"></div>
      <div className="absolute bottom-1/3 left-1/4 w-28 h-28 bg-gradient-to-br from-purple-100/25 to-blue-100/15 rounded-full blur-2xl -z-10" style={{animationDelay: '2s'}}></div>
      
      {/* Section Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative z-10"
      >
        <h2 className="text-2xl font-extrabold text-blue-700 mb-6">Current Bookings:</h2>
      </motion.div>

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
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <AnimatePresence>
            {bookings.map((booking, index) => (
              <motion.div
                key={booking.bookingId}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <BookingCard
                  booking={booking}
                  onAction={handleBookingAction}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
}
