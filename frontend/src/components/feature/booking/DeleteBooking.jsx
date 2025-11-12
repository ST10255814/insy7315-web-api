import { DeleteEntityComponent, EntityDetailsCard} from "../../common/index.js";
import { formatAmount, formatDateUS } from "../../../utils/formatters.js";
import {
  useBookingByIdQuery,
  useDeleteBookingMutation,
} from "../../../utils/queries.js";

export default function DeleteBooking() {
  const renderBookingDetails = (booking) => (
    <EntityDetailsCard
      heading="Invoice Details"
      fields={[
        { label: "Booking ID", value: booking.newBooking.bookingId },
        { label: "No of Guests", value: booking.newBooking.numberOfGuests },
        { label: "Amount", value: `R${formatAmount(booking.newBooking.totalPrice)}` },
        { label: "Duration", value: `${formatDateUS(booking.newBooking.checkInDate)} to ${formatDateUS(booking.newBooking.checkOutDate)}` },
      ]}
    />
  );

  return (
    <DeleteEntityComponent
      entityType="booking"
      entityDisplayName="Booking"
      entityIdParam="bookingID"
      useEntityByIdQuery={useBookingByIdQuery}
      useDeleteEntityMutation={useDeleteBookingMutation}
      renderEntityDetails={renderBookingDetails}
      basePath="/bookings"
    />
  );
}
