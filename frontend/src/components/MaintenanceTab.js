import React from "react";
import { motion } from "framer-motion";

export default function MaintenanceTab() {
  const tempMaintenance = [
    {
      title: "Heating Issue",
      description: "The heating system is not working in the living room.",
      property: "Unit 4A",
      tenant: "Sarah Johnson",
      caretaker: "Bob Wilson",
      status: "Pending",
      priority: "High",
      followUps: 0,
      notes: "",
      updatedAt: "2025-10-12",
    },
    {
      title: "Leaky Faucet",
      description: "Kitchen faucet leaks continuously, water waste is high.",
      property: "Unit 12B",
      tenant: "Alice Brown",
      caretaker: "Mike Johnson",
      status: "In Progress",
      priority: "Medium",
      followUps: 3,
      notes: "Started yesterday",
      updatedAt: "2025-10-11",
    },
    {
      title: "Broken Window",
      description: "Living room window shattered, needs replacement.",
      property: "Unit 3D",
      tenant: "Mark Lee",
      caretaker: "Steve Smith",
      status: "Completed",
      priority: "Low",
      followUps: 0,
      notes: "Replaced glass",
      updatedAt: "2025-10-10",
    },
    {
      title: "Clogged Drain",
      description: "Bathroom drain is blocked and slow draining.",
      property: "Unit 8A",
      tenant: "Mary Jane",
      caretaker: "Bob Wilson",
      status: "Pending",
      priority: "Medium",
      followUps: 0,
      notes: "",
      updatedAt: "2025-10-12",
    },
  ];

  const statusMap = {
    Pending: { label: "Unassigned", color: "text-red-600" },
    "In Progress": { label: "In Progress", color: "text-yellow-600" },
    Completed: { label: "Completed", color: "text-green-600" },
  };

  const priorityColor = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-green-100 text-green-700",
  };

  const grouped = tempMaintenance.reduce((acc, req) => {
    const key = req.status.trim();
    if (!acc[key]) acc[key] = [];
    acc[key].push(req);
    return acc;
  }, {});

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 20,
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div initial="hidden" animate="visible" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["Pending", "In Progress", "Completed"].map((status) => {
          const requests = grouped[status] || [];
          const statusColor =
            status === "Pending"
              ? "red-600"
              : status === "In Progress"
              ? "yellow-600"
              : "green-600";

          return (
            <div key={status} className="space-y-4">
              {/* Column Label */}
              <h2
                className={`text-lg font-bold flex items-center gap-3 text-${statusColor}`}
              >
                {statusMap[status]?.label} ({requests.length})
              </h2>

              <div className="space-y-4">
                {requests.length === 0 ? (
                  <p className="text-gray-400 italic">No requests</p>
                ) : (
                  requests.map((req, i) => (
                    <motion.div
                      key={i}
                      variants={cardVariants}
                      whileHover={{
                        scale: 1.03,
                        y: -2,
                        boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
                      }}
                      className="relative bg-white p-6 rounded-3xl shadow-md border border-gray-100 cursor-pointer transition-all duration-300"
                    >
                      {/* Priority Badge */}
                      <div
                        className={`absolute top-4 right-4 px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm ${
                          priorityColor[req.priority] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {req.priority || "Normal"}
                      </div>

                      {/* Title */}
                      <p className="font-bold text-blue-700 text-lg mb-2">
                        {req.title}
                      </p>

                      {/* Description */}
                      <p className="text-gray-600 italic mb-3">
                        {req.description}
                      </p>

                      {/* Property & Tenant */}
                      <div className="space-y-1 mb-3">
                        <p className="text-gray-600">
                          <span className="font-semibold">Property:</span>{" "}
                          {req.property}
                        </p>
                        <p className="text-green-700 italic">
                          <span className="font-semibold">Caretaker:</span>{" "}
                          {req.caretaker || "Unassigned"}
                        </p>
                      </div>

                      {/* Follow-ups as integer */}
                      <p className="text-gray-500 mb-3">
                        <span className="font-semibold">Follow-ups:</span>{" "}
                        {req.followUps}
                      </p>

                      {/* Caretaker Notes Bubble */}
                      {req.notes && (
                        <motion.div
                          whileHover={{
                            scale: 1.02,
                            boxShadow: "0 6px 25px rgba(0,0,0,0.08)",
                          }}
                          className="mt-3 p-3 bg-green-50 border-l-4 border-green-500 rounded-md shadow-sm transition-all duration-200"
                        >
                          <p className="font-semibold text-green-800 text-sm mb-1">
                            Caretaker Notes
                          </p>
                          <p className="text-green-900 text-sm">{req.notes}</p>
                        </motion.div>
                      )}

                      {/* Updated Date */}
                      <p className="text-gray-400 text-sm mt-3">
                        Updated: {req.updatedAt}
                      </p>

                      {/* Action Buttons */}
                      {status === "Pending" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="mt-3 px-4 py-2 font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow transition-all"
                        >
                          Assign Caretaker
                        </motion.button>
                      )}
                      {status === "In Progress" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="mt-3 px-4 py-2 font-medium bg-green-600 text-white rounded-xl hover:bg-green-700 shadow transition-all"
                        >
                          Complete
                        </motion.button>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
