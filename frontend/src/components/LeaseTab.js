import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LeasesTab() {
  const [leases, setLeases] = useState([
    {
      tenant: "John Smith",
      property: "Unit 4A",
      startDate: "2025-10-01",
      endDate: "2026-09-30",
      rent: 12500,
      status: "Active",
    },
    {
      tenant: "Jane Doe",
      property: "Unit 5B",
      startDate: "2025-11-01",
      endDate: "2026-10-31",
      rent: 14000,
      status: "Pending",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newLease, setNewLease] = useState({
    tenant: "",
    property: "",
    startDate: "",
    endDate: "",
    rent: "",
    status: "Pending",
  });

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
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

  const handleAddLease = (e) => {
    e.preventDefault();
    setLeases([...leases, newLease]);
    setNewLease({
      tenant: "",
      property: "",
      startDate: "",
      endDate: "",
      rent: "",
      status: "Pending",
    });
    setShowForm(false);
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
          onClick={() => setShowForm(!showForm)}
          whileHover={{
            scale: 1.08,
            backgroundColor: "#2563eb",
            boxShadow: "0px 8px 15px rgba(0,0,0,0.2)",
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md"
        >
          {showForm ? "Close Form" : "+ Add Lease"}
        </motion.button>
      </div>

      {/* Animated Add Lease Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg mb-8 border border-blue-100"
          >
            <h4 className="text-2xl font-bold text-blue-700 mb-4">
              Add New Lease
            </h4>

            <form
              onSubmit={handleAddLease}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-blue-800 font-semibold mb-1">
                  Tenant Name
                </label>
                <input
                  type="text"
                  required
                  value={newLease.tenant}
                  onChange={(e) =>
                    setNewLease({ ...newLease, tenant: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-blue-800 font-semibold mb-1">
                  Property
                </label>
                <input
                  type="text"
                  required
                  value={newLease.property}
                  onChange={(e) =>
                    setNewLease({ ...newLease, property: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-blue-800 font-semibold mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  required
                  value={newLease.startDate}
                  onChange={(e) =>
                    setNewLease({ ...newLease, startDate: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-blue-800 font-semibold mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  required
                  value={newLease.endDate}
                  onChange={(e) =>
                    setNewLease({ ...newLease, endDate: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-blue-800 font-semibold mb-1">
                  Rent (R)
                </label>
                <input
                  type="number"
                  required
                  value={newLease.rent}
                  onChange={(e) =>
                    setNewLease({ ...newLease, rent: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-blue-800 font-semibold mb-1">
                  Status
                </label>
                <select
                  value={newLease.status}
                  onChange={(e) =>
                    setNewLease({ ...newLease, status: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                >
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Inactive</option>
                </select>
              </div>

              <div className="md:col-span-2 text-right">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md mt-2"
                >
                  Add Lease
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table (desktop) + Card View (mobile) */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 hidden md:block">
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
                whileHover={{
                  scale: 1.02,
                  backgroundColor: "rgba(242, 247, 255, 0.6)",
                }}
                transition={{ type: "tween", duration: 0.3 }}
                className="border-b border-gray-100"
              >
                <td className="px-3 py-3 text-blue-700 font-semibold">
                  {lease.tenant}
                </td>
                <td className="px-3 py-3 text-black">{lease.property}</td>
                <td className="px-3 py-3 text-black">
                  {formatDate(lease.startDate)}
                </td>
                <td className="px-3 py-3 text-black">
                  {formatDate(lease.endDate)}
                </td>
                <td className="px-3 py-3 font-bold text-blue-600">
                  R{Number(lease.rent).toLocaleString()}
                </td>
                <td className="px-3 py-3">
                  <span
                    className={`${getStatusClasses(
                      lease.status
                    )} font-semibold px-3 py-1 rounded-full`}
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
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card layout for small screens */}
      <div className="md:hidden space-y-4">
        {leases.map((lease, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02 }}
            className="bg-white shadow-md rounded-xl p-4 border border-blue-100"
          >
            <h4 className="text-lg font-bold text-blue-800">{lease.tenant}</h4>
            <p className="text-gray-600 mb-2">{lease.property}</p>
            <p className="text-sm">
              <strong className="text-blue-700">Start:</strong>{" "}
              {formatDate(lease.startDate)}
            </p>
            <p className="text-sm">
              <strong className="text-blue-700">End:</strong>{" "}
              {formatDate(lease.endDate)}
            </p>
            <p className="text-sm text-blue-700 font-semibold mt-2">
              Rent: R{Number(lease.rent).toLocaleString()}
            </p>
            <span
              className={`${getStatusClasses(
                lease.status
              )} inline-block font-semibold px-3 py-1 rounded-full text-sm mt-2`}
            >
              {lease.status}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
