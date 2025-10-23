import { motion } from "framer-motion";
import { priorityColor } from "../constants/status.js";
import {
  FaDownload,
  FaUser,
  FaHome,
  FaCalendarAlt,
  FaTools,
  FaExclamationCircle,
  FaCommentDots,
  FaIdBadge,
  FaFileAlt,
} from "react-icons/fa";
import { downloadFiles } from "../utils/fileDownload.js";
import { formatDateTimeUS } from "../utils/formatters.js";

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function MaintenanceCard({ request }) {
  return (
    <motion.div
      variants={cardVariants}
      style={{ willChange: "transform, box-shadow" }}
      className="relative bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100"
    >
      {/* Priority Badge */}
      <div
        className={`absolute top-3 right-3 sm:top-4 sm:right-4 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow-sm ${
          priorityColor[request.priority] || "bg-gray-100 text-gray-600"
        }`}
      >
        {request.priority || "Low"}
      </div>

      {/* Header Section with Title and ID */}
      <div className="mb-3 sm:mb-4">
        <div className="flex items-start gap-2 mb-2 pr-16 sm:pr-20">
          <FaExclamationCircle className="text-red-500 text-sm flex-shrink-0 mt-2" />
          <h3 className="font-bold text-blue-700 text-base sm:text-lg leading-tight">{request.issue}</h3>
        </div>

        {/* Maintenance ID */}
        <div className="flex items-center gap-2 mb-3 text-xs sm:text-sm flex-wrap">
          <FaIdBadge className="text-blue-500 text-xs flex-shrink-0" />
          <span className="font-medium text-gray-700">Request ID:</span>
          <span className="font-mono text-blue-500 bg-blue-50 px-2 py-1 rounded text-xs sm:text-sm">
            {request.maintenanceID || "N/A"}
          </span>
        </div>

        {/* Description Section */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FaFileAlt className="text-gray-500 text-sm flex-shrink-0" />
            <h4 className="font-semibold text-gray-800 text-sm">Description:</h4>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg">
            {request.description}
          </p>
        </div>
      </div>

      {/* Property & Tenant Info */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-3 text-gray-700 text-sm">
          <FaUser className="text-blue-500 text-sm flex-shrink-0" />
          <span className="font-medium min-w-0">Tenant:</span>
          <span className="text-gray-900 font-medium truncate">{request.tenantName}</span>
        </div>

        <div className="flex items-center gap-3 text-gray-700 text-sm">
          <FaHome className="text-green-500 text-sm flex-shrink-0" />
          <span className="font-medium min-w-0">Property:</span>
          <span className="text-gray-900 font-medium truncate">{request.property}</span>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <FaTools className="text-orange-500 text-sm flex-shrink-0" />
          <span className="font-medium text-gray-700 min-w-0">Caretaker:</span>
          <span
            className={
              request.caretaker
                ? "text-green-700 font-semibold"
                : "text-red-500 italic font-medium"
            }
          >
            {request.caretaker || "Unassigned"}
          </span>
        </div>
      </div>

      {/* Follow-ups & Follow-Up Date */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-2 text-sm text-blue-700">
          <FaCommentDots className="text-sm flex-shrink-0" />
          <span className="font-medium">Follow-ups:</span>
          <span className="font-bold text-blue-800">{request.followUps || 0}</span>
        </div>
      </div>

      {/* Caretaker Notes */}
      {request.notes && (
        <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FaCommentDots className="text-green-600 text-sm flex-shrink-0" />
            <p className="font-semibold text-green-800 text-sm">
              Caretaker Notes
            </p>
          </div>
          <p className="text-green-900 text-sm leading-relaxed">
            {request.notes}
          </p>
        </div>
      )}

      {/* Follow-Up Date */}
      <div className="flex items-center gap-2 mb-3 text-xs sm:text-sm flex-wrap">
        <FaCalendarAlt className="text-blue-500 text-xs flex-shrink-0" />
        <span className="font-medium text-gray-700">Created At:</span>
        <i className="text-gray-500 py-1 rounded text-xs sm:text-sm">
          {formatDateTimeUS(request.createdAt) || "No Created At Date"}
        </i>
      </div>

      {/* Updated Time */}
      {request.updatedAt && (
        <p className="text-gray-400 text-xs mb-4 text-center truncate">
          Last updated: {formatDateTimeUS(request.updatedAt)}
        </p>
      )}

      {/* Action Buttons */}
      <div className="space-y-2 mt-3 sm:mt-4">
        {/* Primary Action Button */}
        {request.status === "Pending" && (
          <motion.button
            whileHover={{
              scale: 1.02,
              boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
              transition: { duration: 0.15, ease: "easeOut" },
            }}
            whileTap={{ scale: 0.975 }}
            style={{ willChange: "transform, box-shadow" }}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg sm:rounded-xl shadow-md transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <FaTools size={12} className="sm:w-3.5 sm:h-3.5" />
            <span className="truncate">Assign Caretaker</span>
          </motion.button>
        )}

        {/* Download Button - Only show for Pending requests */}
        {request.status === "Pending" && request.documentURL && request.documentURL.length > 0 && (
          <motion.button
            whileHover={{
              scale: 1.02,
              boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
              transition: { duration: 0.15, ease: "easeOut" },
            }}
            whileTap={{ scale: 0.975 }}
            onClick={() => downloadFiles(request.documentURL)}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg sm:rounded-xl border border-indigo-200 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <FaDownload size={10} className="sm:w-3 sm:h-3 flex-shrink-0" />
            <span className="truncate">Download Attached Docs ({request.documentURL.length})</span>
          </motion.button>
        )}
        {request.status === "In Progress" && (
          <motion.button
            whileHover={{
              scale: 1.02,
              boxShadow: "0 4px 12px rgba(34,197,94,0.3)",
              transition: { duration: 0.15, ease: "easeOut" },
            }}
            whileTap={{ scale: 0.975 }}
            style={{ willChange: "transform, box-shadow" }}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold bg-green-600 hover:bg-green-700 text-white rounded-lg sm:rounded-xl shadow-md transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <FaTools size={12} className="sm:w-3.5 sm:h-3.5" />
            <span className="truncate">Update Request</span>
          </motion.button>
        )}
      </div>

      {/* Updated Time - Moved to bottom */}
      {request.updatedAt && (
        <p className="text-gray-400 text-xs mt-2 sm:mt-3 text-center truncate">
          Last updated: {request.updatedAt}
        </p>
      )}
    </motion.div>
  );
}
