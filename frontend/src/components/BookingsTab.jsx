import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlusCircle } from "react-icons/fa";
import Toast from "../lib/toast.js";
import LoadingSkeleton from "../pages/LoadingSkeleton.jsx";
import BookingCard from "../pages/BookingCard.jsx";
import AddBookingModal from "../models/AddBookingModel.jsx";
// import { useParams } from "react-router-dom"; // TODO: Uncomment when integrating queries

export default function BookingsTab() {
  // const { userId: adminId } = useParams(); // TODO: Use when integrating with queries
  
  // Temporary state to simulate loading and data
  const [isLoading, setIsLoading] = useState(true); // TODO: Replace with actual query loading state
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Temporary bookings data - replace with actual query later
  const tempBookings = [
    {
      bookingId: "BK001",
      guestName: "John Smith",
      guestEmail: "john.smith@email.com",
      property: {
        name: "Ocean View Apartment 2A",
        address: "123 Seaside Drive, Cape Town"
      },
      checkIn: "2025-10-25",
      checkOut: "2025-10-30",
      guests: 2,
      totalAmount: 2500.00,
      status: "confirmed",
      bookingDate: "2025-10-20",
      specialRequests: "Late check-in requested"
    },
    {
      bookingId: "BK002",
      guestName: "Sarah Johnson",
      guestEmail: "sarah.j@email.com",
      property: {
        name: "Downtown Loft B1",
        address: "456 City Centre, Johannesburg"
      },
      checkIn: "2025-11-01",
      checkOut: "2025-11-07",
      guests: 4,
      totalAmount: 4200.00,
      status: "pending",
      bookingDate: "2025-10-18",
      specialRequests: "Extra towels needed"
    },
    {
      bookingId: "BK003",
      guestName: "Michael Brown",
      guestEmail: "m.brown@email.com",
      property: {
        name: "Garden Villa C3",
        address: "789 Suburb Lane, Durban"
      },
      checkIn: "2025-11-15",
      checkOut: "2025-11-20",
      guests: 6,
      totalAmount: 3000.00,
      status: "cancelled",
      bookingDate: "2025-10-15",
      specialRequests: "Pet-friendly accommodation"
    }
  ];

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
       setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const bookings = tempBookings;
  const isError = false;

  const handleBookingAction = (action, booking) => {
    switch (action) {
      case "Edit":
        Toast.info(`Editing booking ${booking.bookingId}`);
        break;
      case "Delete":
        Toast.info(`Deleting booking ${booking.bookingId}`);
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

  const handleAddBookingSubmit = (bookingData) => {
    console.log("Adding Booking:", bookingData);
    // TODO: Replace with actual mutation
    // createBookingMutation.mutate(bookingData, {
    //   onSuccess: () => {
    //     setShowAddModal(false);
    //   },
    // });
    setShowAddModal(false);
    Toast.success("Booking added successfully!");
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

      {/* Add Booking Modal */}
      <AddBookingModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddBookingSubmit}
        isPending={false} // TODO: Replace with actual mutation pending state
      />
    </motion.div>
  );
}
