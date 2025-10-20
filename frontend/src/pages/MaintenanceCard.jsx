import React from "react";
import { motion } from "framer-motion";
import { priorityColor } from "../constants/status.js";

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function MaintenanceCard({ request }) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        scale: 1.015,
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      style={{ willChange: "transform, box-shadow" }}
      className="relative bg-white p-6 rounded-3xl shadow-sm border border-gray-100 cursor-pointer"
    >
      {/* Priority Badge */}
      <div
        className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm ${
          priorityColor[request.priority] || "bg-gray-100 text-gray-600"
        }`}
      >
        {request.priority || "Normal"}
      </div>

      {/* Title & Description */}
      <p className="font-bold text-blue-700 text-lg mb-2">{request.title}</p>
      <p className="text-gray-600 italic mb-3">{request.description}</p>

      {/* Property & Caretaker */}
      <div className="space-y-1 mb-3">
        <p className="text-gray-600">
          <span className="font-semibold">Property:</span> {request.property}
        </p>
        <p className="text-green-700 italic">
          <span className="font-semibold">Caretaker:</span> {request.caretaker || "Unassigned"}
        </p>
      </div>

      {/* Follow-ups */}
      <p className="text-gray-500 mb-3">
        <span className="font-semibold">Follow-ups:</span> {request.followUps}
      </p>

      {/* Notes */}
      {request.notes && (
        <div className="mt-3 p-3 bg-green-50 border-l-4 border-green-500 rounded-md shadow-sm">
          <p className="font-semibold text-green-800 text-sm mb-1">Caretaker Notes</p>
          <p className="text-green-900 text-sm">{request.notes}</p>
        </div>
      )}

      {/* Updated/Created at */}
      <p className="text-gray-400 text-sm mt-3">Updated: {request.updatedAt}</p>

      <p className="text-gray-400 text-sm mt-1">Created: {request.createdAt}</p>

      {/* Attached Documents */}
      <a href={`${request.imageURL}`} className="text-blue-700 text-sm mt-2">
        <span className="sr-only">View Attached Docs</span>
      </a>

      {/* Buttons */}
      <div className="mt-3 flex gap-2">
        {request.status === "Pending" && (
          <motion.button
            whileHover={{
              scale: 1.02,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              transition: { duration: 0.15, ease: "easeOut" },
            }}
            whileTap={{ scale: 0.975 }}
            style={{ willChange: "transform, box-shadow" }}
            className="px-3 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-xl shadow-sm"
          >
            Assign Caretaker
          </motion.button>
        )}

        {request.status === "In Progress" && (
          <motion.button
            whileHover={{
              scale: 1.02,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              transition: { duration: 0.15, ease: "easeOut" },
            }}
            whileTap={{ scale: 0.975 }}
            style={{ willChange: "transform, box-shadow" }}
            className="px-3 py-2.5 text-sm font-medium bg-green-600 text-white rounded-xl shadow-sm"
          >
            Update Maintenance Request
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
