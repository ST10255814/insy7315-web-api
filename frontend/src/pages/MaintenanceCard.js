import React from "react";
import { motion } from "framer-motion";

const priorityColor = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Low: "bg-green-100 text-green-700",
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function MaintenanceCard({ request }) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        scale: 1.01,
        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        transition: { duration: 0.25, ease: "easeOut" },
      }}
      style={{ willChange: "transform" }}
      className="relative bg-white p-6 rounded-3xl shadow-sm border border-gray-100 cursor-pointer transition-all duration-200"
    >
      <div
        className={`absolute top-4 right-4 px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm ${
          priorityColor[request.priority] || "bg-gray-100 text-gray-600"
        }`}
      >
        {request.priority || "Normal"}
      </div>

      <p className="font-bold text-blue-700 text-lg mb-2">{request.title}</p>
      <p className="text-gray-600 italic mb-3">{request.description}</p>

      <div className="space-y-1 mb-3">
        <p className="text-gray-600">
          <span className="font-semibold">Property:</span> {request.property}
        </p>
        <p className="text-green-700 italic">
          <span className="font-semibold">Caretaker:</span> {request.caretaker || "Unassigned"}
        </p>
      </div>

      <p className="text-gray-500 mb-3">
        <span className="font-semibold">Follow-ups:</span> {request.followUps}
      </p>

      {request.notes && (
        <div className="mt-3 p-3 bg-green-50 border-l-4 border-green-500 rounded-md shadow-sm">
          <p className="font-semibold text-green-800 text-sm mb-1">Caretaker Notes</p>
          <p className="text-green-900 text-sm">{request.notes}</p>
        </div>
      )}

      <p className="text-gray-400 text-sm mt-3">Updated: {request.updatedAt}</p>
    </motion.div>
  );
}
