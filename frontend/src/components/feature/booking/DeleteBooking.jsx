import { DeleteEntityComponent } from "../../common/index.js";
import { formatAmount } from "../../../utils/formatters.js";
import {
  useBookingByIdQuery,
  useDeleteBookingMutation,
} from "../../../utils/queries.js";

export default function DeleteBooking() {
  const renderBookingDetails = (booking) => (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-600">Property:</span>
        <span className="font-medium text-blue-700">{booking.propertyTitle}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Guest:</span>
        <span className="font-medium text-blue-700">{booking.guestName}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Amount:</span>
        <span className="font-medium text-blue-700">
          {formatAmount(booking.totalAmount)}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Duration:</span>
        <span className="font-medium text-blue-700">
          {booking.checkIn} to {booking.checkOut}
        </span>
      </div>
    </div>
  );

  return (
    <DeleteEntityComponent
      entityType="booking"
      entityDisplayName="Booking"
      entityIdParam="bookingId"
      useEntityByIdQuery={useBookingByIdQuery}
      useDeleteEntityMutation={useDeleteBookingMutation}
      renderEntityDetails={renderBookingDetails}
      basePath="/bookings"
    />
  );
}