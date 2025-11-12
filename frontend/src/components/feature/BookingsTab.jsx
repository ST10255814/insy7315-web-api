import { motion, AnimatePresence } from "framer-motion";
import Toast from "../../lib/toast.js";
import {
  TabWrapper,
  StateHandler,
  SectionHeading,
} from "../common/index.js";
import { useBookingsQuery } from "../../utils/queries.js";
import { Routes, Route, useParams, useNavigate } from "react-router-dom";
import DashboardNotFound from "../feature/DashboardNotFound.jsx";
import DeleteBooking from "./booking/DeleteBooking.jsx";
import BookingCard from "./booking/BookingCard.jsx";

export default function BookingsTab() {
  return (
    <Routes>
      <Route path="delete/:bookingID" element={<DeleteBooking />} />
      <Route index element={<BookingsListView />} />
      <Route path="*" element={<DashboardNotFound />} />
    </Routes>
  );
}

function BookingsListView() {
  const { userId: adminId } = useParams();
  const { isLoading, isError, data: bookings = [] } = useBookingsQuery(adminId);

  const navigate = useNavigate();

  const handleBookingAction = (action, booking) => {
    switch (action) {
      case "Delete":
        navigate(`delete/${booking.bookingID}`);
        break;
      default:
        break;
    }
  };

  return (
    <TabWrapper decorativeElements="default">
      <SectionHeading title="Current Bookings:" />

      <StateHandler
        isLoading={isLoading}
        isError={isError}
        data={bookings}
        errorMessage="Failed to load bookings. Please try again."
        emptyMessage="No bookings found. Add a new booking to get started."
        gridCols="grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
        loadingCount={8}
      >
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <AnimatePresence>
            {bookings.map((booking, index) => (
              <motion.div
                key={booking.bookingID || booking.bookingId || index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <BookingCard booking={booking} onAction={handleBookingAction} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </StateHandler>
    </TabWrapper>
  );
}
