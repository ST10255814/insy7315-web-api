import React, { useState } from "react";
import { motion } from "framer-motion";

export default function LeasesTab() {
  const [leases, setLeases] = useState([
    {
      tenant: "John Smith",
      property: "Unit 4A",
      startDate: "01 Oct 2025",
      endDate: "30 Sep 2026",
      rent: 12500,
      status: "Active",
    },
    {
      tenant: "Jane Doe",
      property: "Unit 5B",
      startDate: "01 Nov 2025",
      endDate: "31 Oct 2026",
      rent: 14000,
      status: "Pending",
    },
  ]);

  const addLease = () => {
    const tenant = prompt("Enter Tenant Name:");
    if (!tenant) return;
    const property = prompt("Enter Property:");
    if (!property) return;
    const startDate = prompt("Enter Start Date (e.g., 01 Oct 2025):");
    if (!startDate) return;
    const endDate = prompt("Enter End Date (e.g., 30 Sep 2026):");
    if (!endDate) return;
    const rent = parseFloat(prompt("Enter Rent Amount:"));
    if (isNaN(rent)) return;
    const status = prompt("Enter Status (Active/Pending/Inactive):");
    if (!status) return;

    const newLease = { tenant, property, startDate, endDate, rent, status };
    setLeases([...leases, newLease]);
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-200 text-green-800";
      case "Pending":
        return "bg-yellow-200 text-yellow-800";
      case "Inactive":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl shadow-2xl p-10 mx-auto w-full max-w-5xl border border-blue-100"
    >
      {/* Header + Add Lease Button */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-3xl font-extrabold text-blue-800">Lease Management</h3>

        <motion.button
          onClick={addLease}
          whileHover={{
            scale: 1.08,
            backgroundColor: "#2563eb",
            boxShadow: "0px 8px 15px rgba(0,0,0,0.2)",
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md"
        >
          + Add Lease
        </motion.button>
      </div>

      {/* Table */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm uppercase tracking-wide">
              <th className="px-4 py-3 rounded-l-2xl">Tenant</th>
              <th className="px-4 py-3">Property</th>
              <th className="px-4 py-3">Start Date</th>
              <th className="px-4 py-3">End Date</th>
              <th className="px-4 py-3">Rent</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 rounded-r-2xl">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leases.map((lease, i) => (
              <motion.tr
                key={i}
                initial={{ scale: 1, backgroundColor: "rgba(242, 247, 255, 0)" }}
                whileHover={{
                  scale: 1.02,
                  backgroundColor: "rgba(242, 247, 255, 0.6)",
                }}
                transition={{ type: "tween", duration: 0.3 }}
                className="border-b border-gray-100"
              >
                <td className="px-3 py-3 text-blue-700 font-semibold">{lease.tenant}</td>
                <td className="px-3 py-3 text-black">{lease.property}</td>
                <td className="px-3 py-3 text-black">{lease.startDate}</td>
                <td className="px-3 py-3 text-black">{lease.endDate}</td>
                <td className="px-3 py-3 font-bold text-blue-600">
                  R{lease.rent.toLocaleString()}
                </td>
                <td className="px-3 py-3">
                  <span
                    className={`${getStatusClasses(lease.status)} font-semibold px-3 py-1 rounded-full`}
                  >
                    {lease.status}
                  </span>
                </td>
                <td className="px-3 py-3 flex justify-center gap-2 flex-wrap">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-blue-600 hover:text-blue-700 font-semibold px-3 py-1 rounded transition"
                  >
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-red-600 hover:text-red-700 font-semibold px-3 py-1 rounded transition"
                  >
                    Delete
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-green-600 hover:text-green-700 font-semibold px-3 py-1 rounded transition"
                  >
                    Activate
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
