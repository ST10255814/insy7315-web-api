import {
  FaEnvelope,
  FaHome,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaUsers,
  FaMoon,
  FaDownload,
  FaRegStickyNote,
} from "react-icons/fa";
import { downloadFiles } from "../../../utils/fileDownload.js";
import { formatDateUS, formatAmount, formatDateTimeUS } from "../../../utils/formatters.js";



export default function BookingPreview({ booking }) {
  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[320px] bg-gradient-to-br from-blue-300/60 via-white/80 to-blue-400/40 rounded-[2.5rem] shadow-2xl w-full border border-blue-100 backdrop-blur-lg animate-fade-in">
        <FaHome className="text-blue-400 text-8xl mb-6 drop-shadow-lg animate-bounce" />
        <span className="text-gray-500 text-2xl font-extrabold tracking-wide">No booking selected</span>
      </div>
    );
  }

  const formattedAmount = formatAmount(booking?.newBooking?.totalPrice);

  return (
    <div className="w-full h-full min-h-[440px] bg-gradient-to-br from-white/80 via-blue-50/80 to-blue-200/60 rounded-[2.5rem] shadow-2xl border border-blue-100 p-0 flex flex-col backdrop-blur-lg animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-10 py-8 border-b border-blue-100 bg-blue-100/40 rounded-t-[2.5rem]">
        <div className="flex-1 min-w-0">
          <h2 className="font-extrabold text-blue-900 text-3xl sm:text-4xl break-words line-clamp-2 mb-2 tracking-tight flex items-center gap-3">
            <FaUsers className="text-blue-400 animate-pulse" size={28} />
            {booking.tenantInfo?.name}
          </h2>
          <div className="flex items-center text-gray-500 text-sm gap-2">
            <FaEnvelope className="flex-shrink-0" size={15} />
            <span className="font-mono truncate">{booking.newBooking.bookingId}</span>
          </div>
        </div>
        <span
          className={`inline-flex items-center px-6 py-2 rounded-full text-base font-bold whitespace-nowrap shadow-lg transition-all duration-200 border border-blue-200 ${booking.newBooking.status === "confirmed" ? "bg-green-100/80 text-green-700" : booking.newBooking.status === "cancelled" ? "bg-red-100/80 text-red-600" : "bg-yellow-100/80 text-yellow-700"}`}
        >
          <FaRegStickyNote className="mr-2 animate-fade-in" size={18} />
          {booking.newBooking.status.charAt(0).toUpperCase() + booking.newBooking.status.slice(1)}
        </span>
      </div>

      {/* Main Info Section */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-12 px-10 py-10">
        <div className="space-y-8">
          <div className="flex items-center gap-4 text-gray-700 text-lg">
            <FaHome className="text-blue-400 flex-shrink-0 mt-0.5 animate-fade-in" size={24} />
            <span className="font-semibold text-gray-800 text-xl break-words">{booking.listingAddress}</span>
          </div>
          <div className="flex items-center gap-4 text-gray-700 text-lg">
            <FaCalendarAlt className="text-blue-400 flex-shrink-0 animate-fade-in" size={20} />
            <span className="font-semibold text-gray-800">Check-in:</span>
            <span className="text-gray-900 font-mono text-lg">{formatDateUS(booking.newBooking.checkInDate)}</span>
          </div>
          <div className="flex items-center gap-4 text-gray-700 text-lg">
            <FaCalendarAlt className="text-blue-400 flex-shrink-0 animate-fade-in" size={20} />
            <span className="font-semibold text-gray-800">Check-out:</span>
            <span className="text-gray-900 font-mono text-lg">{formatDateUS(booking.newBooking.checkOutDate)}</span>
          </div>
        </div>
        <div className="space-y-8">
          <div className="flex items-center gap-4 text-gray-600">
            <FaUsers className="text-blue-400 animate-pulse" size={20} />
            <span><span className="font-bold text-gray-800 text-xl">{booking.newBooking.numberOfGuests}</span> Guests</span>
          </div>
          <div className="flex items-center gap-4 text-gray-600">
            <FaMoon className="text-yellow-400 animate-fade-in" size={20} />
            <span><span className="font-bold text-gray-800 text-xl">{booking.newBooking.nights}</span> Night{booking.newBooking.nights !== 1 ? "s" : ""}</span>
          </div>
          <div className="flex items-center gap-4 text-gray-600">
            <FaMoneyBillWave className="text-green-500 animate-fade-in" size={22} />
            <span className="text-lg font-semibold">Total</span>
            <span className="text-3xl font-extrabold text-blue-700 ml-2 drop-shadow-lg">R{formattedAmount}</span>
          </div>
        </div>
      </div>

      {/* Special Requests */}
      {booking.specialRequests && (
        <div className="bg-blue-50/80 rounded-2xl p-6 mx-10 mb-6 border border-blue-100 shadow-lg backdrop-blur-md">
          <p className="text-sm text-blue-700 font-bold mb-2 flex items-center gap-2">
            <FaRegStickyNote size={16} className="animate-fade-in" /> Special Requests
          </p>
          <p className="text-gray-700 text-lg leading-relaxed font-medium">{booking.specialRequests}</p>
        </div>
      )}

      {/* Download Button */}
      {booking.newBooking.supportDocuments && booking.newBooking.supportDocuments.length > 0 && (
        <button
          className="bg-blue-700/90 hover:bg-blue-800 text-white px-6 py-3 rounded-2xl shadow-xl transition-all duration-200 flex items-center justify-center gap-3 mx-10 mb-6 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={() => downloadFiles(booking.newBooking.supportDocuments)}
        >
          <FaDownload size={18} className="animate-bounce" />
          <span>Download Documents ({booking.newBooking.supportDocuments.length})</span>
        </button>
      )}

      {/* Footer Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-10 py-8 bg-blue-100/40 rounded-b-[2.5rem] border-t border-blue-100 text-base text-gray-500 mt-auto">
        <span>
          <span className="font-bold text-gray-600">Created:</span> {formatDateTimeUS(booking.newBooking.createdAt)}
        </span>
        {booking.newBooking.updatedAt && (
          <span>
            <span className="font-bold text-gray-600">Last updated:</span> {formatDateTimeUS(booking.newBooking.updatedAt)}
          </span>
        )}
      </div>
    </div>
  );
}