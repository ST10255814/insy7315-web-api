import { motion } from "framer-motion";
import {
  FaEdit,
  FaTrash,
  FaIdBadge,
  FaEnvelope,
  FaPhone,
  FaBriefcase,
  FaUser,
} from "react-icons/fa";
import HoverActionButton from "../../common/HoverActionButton.jsx";
import { professionClasses } from "../../../constants/constants.js";

export default function CaretakerCard({ caretaker, onAction }) {
  return (
    <motion.div
      className="relative bg-white rounded-xl shadow-md hover:shadow-lg p-4 sm:p-5 flex flex-col justify-between overflow-hidden group cursor-pointer border border-gray-200"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      whileHover={{
        scale: 1.02,
        y: -2,
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        transition: { duration: 0.2 }
      }}
    >
      {/* Card Info */}
      <div className="space-y-3">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 pb-3 border-b border-gray-200">
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-blue-700 text-base sm:text-lg break-words line-clamp-2 mb-1">
              {caretaker.firstName} {caretaker.surname}
            </h4>
            <div className="flex items-center text-gray-500 text-xs gap-1.5">
              <FaIdBadge className="flex-shrink-0" size={11} />
              <span className="font-mono truncate">
                ID: {caretaker.caretakerId}
              </span>
            </div>
          </div>
          
          {/* User Icon Badge */}
          <div className="bg-blue-100 p-2 rounded-full">
            <FaUser className="text-blue-600" size={16} />
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start gap-2">
          <FaEnvelope className="text-gray-400 flex-shrink-0 mt-0.5" size={14} />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-0.5">Email</p>
            <p className="font-medium text-gray-800 text-sm break-words">
              {caretaker.email}
            </p>
          </div>
        </div>

        {/* Phone Number */}
        <div className="flex items-start gap-2">
          <FaPhone className="text-gray-400 flex-shrink-0 mt-0.5" size={14} />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-0.5">Phone</p>
            <p className="font-medium text-gray-800 text-sm break-words">
              {caretaker.phoneNumber}
            </p>
          </div>
        </div>

        {/* Profession */}
        <div className="flex items-start gap-2">
          <FaBriefcase className="text-gray-400 flex-shrink-0 mt-0.5" size={14} />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-0.5">Profession</p>
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                professionClasses[caretaker.profession] || "bg-gray-100 text-gray-800"
              }`}
            >
              {caretaker.profession}
            </span>
          </div>
        </div>
      </div>

      {/* Hover Overlay with Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 z-20 bg-gray-400/10 backdrop-blur-sm rounded-xl flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-4 pointer-events-none group-hover:pointer-events-auto"
      >
        {/* Action Buttons */}
        <HoverActionButton
          icon={<FaEdit size={17} />}
          label="Edit"
          onClick={() => onAction("Edit", caretaker)}
          className="text-blue-600 hover:bg-blue-50"
        />

        <HoverActionButton
          icon={<FaTrash size={17} />}
          label="Delete"
          onClick={() => onAction("Delete", caretaker)}
          className="text-red-600 hover:bg-red-50"
        />
      </motion.div>
    </motion.div>
  );
}
