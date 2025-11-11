import { FaEnvelope, FaHome, FaCalendarAlt, FaMoneyBillWave, FaUsers, FaMoon, FaDownload } from "react-icons/fa";
import { downloadFiles } from "../../../utils/fileDownload.js";
import { formatDateUS, formatAmount } from "../../../utils/formatters.js";

export default function BookingPreview({ booking }) {
  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] bg-gradient-to-br from-blue-100 via-white to-blue-200 rounded-2xl shadow w-full">
        <FaHome className="text-blue-400 text-6xl mb-4" />
        <span className="text-gray-500 text-2xl font-bold">No booking selected</span>
      </div>
    );
  }

  const formattedAmount = formatAmount(booking?.price);

  return (
    <div className="w-full h-full min-h-[400px] bg-white rounded-2xl shadow-lg border border-gray-200 p-0 flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-6 py-6 border-b border-gray-200 bg-blue-50 rounded-t-2xl">
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-blue-700 text-xl sm:text-2xl break-words line-clamp-2 mb-1">
            {booking.tenantInfo?.name}
          </h2>
          <div className="flex items-center text-gray-500 text-xs gap-1.5">
            <FaEnvelope className="flex-shrink-0" size={11} />
            <span className="font-mono truncate">{booking.bookingID}</span>
          </div>
        </div>
        <span className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap ${booking.status === "Confirmed" ? "bg-green-100 text-green-700" : booking.status === "Cancelled" ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-700"}`}>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </span>
      </div>

      {/* Main Info Section */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 px-6 py-8">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-gray-700 text-base">
            <FaHome className="text-gray-400 flex-shrink-0 mt-0.5" size={16} />
            <span className="font-medium text-gray-800 text-base break-words">{booking.listingAddress}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 text-base">
            <FaCalendarAlt className="text-gray-400 flex-shrink-0" size={15} />
            <span className="font-medium text-gray-800">Check-in:</span>
            <span className="text-gray-900">{formatDateUS(booking.checkIn)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 text-base">
            <FaCalendarAlt className="text-gray-400 flex-shrink-0" size={15} />
            <span className="font-medium text-gray-800">Check-out:</span>
            <span className="text-gray-900">{formatDateUS(booking.checkOut)}</span>
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-gray-600">
            <FaUsers className="text-gray-400" size={15} />
            <span><span className="font-semibold text-gray-800">{booking.guests}</span> Guests</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FaMoon className="text-yellow-400" size={15} />
            <span><span className="font-semibold text-gray-800">{booking.nights}</span> Night{booking.nights !== 1 ? "s" : ""}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FaMoneyBillWave className="text-green-500" size={16} />
            <span className="text-base">Total</span>
            <span className="text-xl font-bold text-blue-700 ml-2">R{formattedAmount}</span>
          </div>
        </div>
      </div>

      {/* Special Requests */}
      {booking.specialRequests && (
        <div className="bg-gray-100 rounded-lg p-4 mx-6 mb-4">
          <p className="text-xs text-blue-700 font-medium mb-1">Special Requests</p>
          <p className="text-gray-700 text-sm leading-relaxed">{booking.specialRequests}</p>
        </div>
      )}

      {/* Download Button */}
      {booking.supportDocuments && booking.supportDocuments.length > 0 && (
        <button
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow transition-colors duration-200 flex items-center justify-center gap-2 mx-6 mb-4 text-sm font-medium"
          onClick={() => downloadFiles(booking.supportDocuments)}
        >
          <FaDownload size={13} />
          <span>Download Documents ({booking.supportDocuments.length})</span>
        </button>
      )}

      {/* Footer Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-6 py-6 bg-blue-50 rounded-b-2xl border-t border-gray-200 text-sm text-gray-500">
        <span>
          <span className="font-semibold text-gray-600">Created:</span> {formatDateUS(booking.createdAt)}
        </span>
        {booking.updatedAt && (
          <span>
            <span className="font-semibold text-gray-600">Last updated:</span> {formatDateUS(booking.updatedAt)}
          </span>
        )}
      </div>
    </div>
  );
}