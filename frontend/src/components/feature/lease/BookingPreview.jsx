export default function BookingPreview({ booking }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-white/20 p-6">
      <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white font-bold mr-2">
          2
        </span>
        Booking Details
      </h2>
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
        {!booking ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-base">
              No booking selected. Please select a booking to view details.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600 font-semibold">Booking ID:</span>
              <p className="text-base font-bold text-blue-800 mt-1">{booking.bookingID || "N/A"}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600 font-semibold">Status:</span>
              <p className="text-base font-bold text-green-600 mt-1">{booking.status || "N/A"}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600 font-semibold">Tenant Name:</span>
              <p className="text-base font-bold text-gray-900 mt-1">
                {booking.tenantInfo?.name || "N/A"}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-600 font-semibold">Guests:</span>
              <p className="text-base font-medium text-gray-900 mt-1">{booking.guests || "N/A"}</p>
            </div>
            <div className="md:col-span-2">
              <span className="text-sm text-gray-600 font-semibold">Property:</span>
              <p className="text-base font-bold text-gray-900 mt-1">
                {booking.listingTitle || booking.listingAddress || "N/A"}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-600 font-semibold">Total Price:</span>
              <p className="text-base font-bold text-blue-700 mt-1">
                R {booking.price?.toFixed(2) || "0.00"}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-600 font-semibold">Nights:</span>
              <p className="text-base font-medium text-gray-900 mt-1">{booking.nights || "N/A"}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600 font-semibold">Check In:</span>
              <p className="text-base font-medium text-gray-900 mt-1">{booking.checkIn || "N/A"}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600 font-semibold">Check Out:</span>
              <p className="text-base font-medium text-gray-900 mt-1">{booking.checkOut || "N/A"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
