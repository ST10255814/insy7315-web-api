import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import { useLeasesQuery, useCreateLeaseMutation } from "../utils/queries";

export default function LeasesTab() {
  const { userId: adminId } = useParams();
  const [formData, setFormData] = useState({
    bookingID: "",
    errors: { bookingID: false },
  });
  const [showModal, setShowModal] = useState(false);

  const { status, error, data: leases } = useLeasesQuery(adminId);
  const createLeaseMutation = useCreateLeaseMutation();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      errors: { ...formData.errors, [e.target.name]: false },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.bookingID) {
      setFormData({ ...formData, errors: { bookingID: true } });
      return;
    }
    createLeaseMutation.mutate(formData.bookingID, {
      onSuccess: () => {
        closeModal();
        setFormData({ bookingID: "", errors: { bookingID: false } });
      },
    });
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ bookingID: "", errors: { bookingID: false } });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-GB", {
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

  const buttonHoverTransition = {
    type: "spring",
    stiffness: 800,
    damping: 15,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl shadow-2xl p-6 sm:p-10 mx-auto w-full max-w-6xl border border-blue-100"
    >
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-blue-800">
          Lease Management
        </h3>
        <motion.button
          onClick={() => setShowModal(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={buttonHoverTransition}
          className="w-full sm:w-auto bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md text-center"
        >
          + Add Lease
        </motion.button>
      </div>

      {/* CONTENT AREA */}
      <div className="relative min-h-[250px] flex flex-col items-center justify-center bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-4 sm:p-6">
        {/* LOADING */}
        <AnimatePresence>
          {status === "pending" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-white/70 backdrop-blur-sm z-10"
            >
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-blue-700 font-extrabold text-lg sm:text-xl"
              >
                Loading leases...
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ERROR */}
        <AnimatePresence>
          {status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex items-center justify-center bg-red-100/90 rounded-2xl z-10"
            >
              <motion.p
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                className="text-red-700 font-extrabold text-lg sm:text-xl text-center"
              >
                ❌ Error loading leases:
                <br />
                {error?.message || "Unknown error"}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* EMPTY STATE */}
        {status === "success" && (!leases || leases.length === 0) && (
          <p className="text-gray-500 text-center w-full mt-4">
            No leases found.
          </p>
        )}

        {/* DESKTOP TABLE */}
        {status === "success" && leases?.length > 0 && (
          <div className="hidden sm:block w-full overflow-x-auto rounded-2xl">
            <table className="min-w-full text-sm sm:text-base text-center border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white uppercase tracking-wide text-xs sm:text-sm">
                  <th className="px-4 py-3 rounded-l-2xl">Booking ID</th>
                  <th className="px-4 py-3">Tenant</th>
                  <th className="px-4 py-3">Property</th>
                  <th className="px-4 py-3">Start</th>
                  <th className="px-4 py-3">End</th>
                  <th className="px-4 py-3">Rent</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 rounded-r-2xl">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {leases.map((lease, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="border-b border-gray-100 hover:bg-blue-50/60 transition-colors duration-200"
                    >
                      <td className="px-3 py-3 text-blue-700 font-bold whitespace-nowrap">
                        {lease.bookingDetails.bookingId}
                      </td>
                      <td className="px-3 py-3">
                        <strong>{lease.tenant.fullname}</strong>
                      </td>
                      <td className="px-3 py-3">{lease.listing.address}</td>
                      <td className="px-3 py-3">
                        {formatDate(lease.bookingDetails.startDate)}
                      </td>
                      <td className="px-3 py-3">
                        {formatDate(lease.bookingDetails.endDate)}
                      </td>
                      <td className="px-3 py-3 font-bold text-blue-600">
                        R{lease.bookingDetails.rentAmount.toLocaleString()}
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`${getStatusClasses(
                            lease.status
                          )} font-semibold px-3 py-1 rounded-full text-xs sm:text-sm`}
                        >
                          {lease.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 flex justify-center gap-2 flex-wrap">
                        {["Edit", "Delete", "Activate"].map((action, j) => (
                          <motion.button
                            key={j}
                            whileHover={{ scale: 1.12 }}
                            whileTap={{ scale: 0.95 }}
                            transition={buttonHoverTransition}
                            className={`${
                              action === "Edit"
                                ? "text-blue-600 hover:text-blue-700"
                                : action === "Delete"
                                ? "text-red-600 hover:text-red-700"
                                : "text-green-600 hover:text-green-700"
                            } font-semibold px-3 py-1 rounded text-xs sm:text-sm`}
                          >
                            {action}
                          </motion.button>
                        ))}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}

        {/* MOBILE CARD VIEW */}
        {status === "success" && leases?.length > 0 && (
          <div className="sm:hidden mt-4 space-y-4 relative w-full">
            <AnimatePresence>
              {leases.map((lease, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-4 rounded-xl shadow-md border border-gray-200 relative"
                >
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-blue-800 text-lg">
                      {lease.tenant.fullname}
                    </h4>
                    <span
                      className={`${getStatusClasses(
                        lease.status
                      )} font-semibold px-3 py-1 rounded-full text-xs`}
                    >
                      {lease.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p>
                      <strong>Booking ID:</strong>{" "}
                      {lease.bookingDetails.bookingId}
                    </p>
                    <p>
                      <strong>Property:</strong> {lease.listing.address}
                    </p>
                    <p>
                      <strong>Duration:</strong>{" "}
                      {formatDate(lease.bookingDetails.startDate)} –{" "}
                      {formatDate(lease.bookingDetails.endDate)}
                    </p>
                    <p className="text-blue-700 font-semibold">
                      Rent: R{lease.bookingDetails.rentAmount.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex justify-end gap-3 mt-3">
                    {["Edit", "Delete", "Activate"].map((action, j) => (
                      <motion.button
                        key={j}
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.95 }}
                        transition={buttonHoverTransition}
                        className={`${
                          action === "Edit"
                            ? "text-blue-600 hover:text-blue-700"
                            : action === "Delete"
                            ? "text-red-600 hover:text-red-700"
                            : "text-green-600 hover:text-green-700"
                        } text-xs font-semibold`}
                      >
                        {action}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ADD LEASE MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-gray-900/20 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.3, type: "spring" }}
              className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md border border-gray-200"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-blue-800 mb-6 text-center">
                Add New Lease
              </h3>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <motion.div
                  animate={
                    formData.errors.bookingID && !formData.bookingID
                      ? { x: [0, -5, 5, -5, 5, 0] }
                      : {}
                  }
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-semibold text-blue-700 mb-1">
                    Booking ID
                  </label>
                  <input
                    type="text"
                    name="bookingID"
                    value={formData.bookingID}
                    onChange={handleChange}
                    placeholder="Enter Booking ID"
                    className={`w-full px-3 py-2 border rounded-xl shadow-sm transition outline-none ${
                      formData.errors.bookingID && !formData.bookingID
                        ? "border-[#FF3B30] focus:ring-2 focus:ring-[#FF3B30]"
                        : "border-gray-300 focus:ring-2 focus:ring-blue-700"
                    }`}
                  />
                  {formData.errors.bookingID && (
                    <p className="text-[#FF3B30] text-sm mt-1 font-semibold">
                      Booking ID is required
                    </p>
                  )}
                </motion.div>

                <div className="flex justify-end gap-3 mt-4">
                  <motion.button
                    type="button"
                    onClick={closeModal}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={buttonHoverTransition}
                    className="px-4 py-2 rounded-lg font-semibold bg-blue-700 text-white hover:bg-blue-800 shadow-md"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={createLeaseMutation.isPending}
                    whileHover={
                      !createLeaseMutation.isPending ? { scale: 1.1 } : {}
                    }
                    whileTap={
                      !createLeaseMutation.isPending ? { scale: 0.95 } : {}
                    }
                    transition={buttonHoverTransition}
                    className={`px-5 py-2 rounded-lg font-semibold shadow-md text-white flex items-center justify-center gap-2 ${
                      createLeaseMutation.isPending
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-700 hover:bg-blue-800"
                    }`}
                  >
                    {createLeaseMutation.isPending ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      "Add Lease"
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}