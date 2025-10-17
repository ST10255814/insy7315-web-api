import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";

const statusColors = {
  Active: "bg-green-100 text-green-800",
  "Expiring Soon": "bg-amber-100 text-amber-800",
  Expired: "bg-red-100 text-red-800",
  Pending: "bg-yellow-100 text-yellow-800",
};

export default function EditLeaseModal({
  show,
  onClose,
  lease,
  onSubmit,
  isPending,
}) {
  const buttonHoverTransition = { type: "spring", stiffness: 300, damping: 20 };
  const [editData, setEditData] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (lease) {
      setEditData({
        tenantName: lease.tenant.fullname || "",
        rent: lease.bookingDetails.rentAmount || "",
        property: lease.listing.address || "",
        startDate: lease.bookingDetails?.startDate?.slice(0, 10) || "",
        endDate: lease.bookingDetails?.endDate?.slice(0, 10) || "",
        status: lease.status || "",
      });
      setHasChanges(false);
    }
  }, [lease]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...editData, [name]: value };
    setEditData(updatedData);

    const changed =
      JSON.stringify(updatedData) !==
      JSON.stringify({
        tenantName: lease.tenant.fullname || "",
        rent: lease.bookingDetails.rentAmount || "",
        property: lease.listing.address || "",
        startDate: lease.bookingDetails?.startDate?.slice(0, 10) || "",
        endDate: lease.bookingDetails?.endDate?.slice(0, 10) || "",
        status: lease.status || "",
      });
    setHasChanges(changed);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const changedFields = {};
    Object.keys(editData).forEach((key) => {
      const oldValue =
        key === "startDate" || key === "endDate"
          ? lease.bookingDetails?.[key]?.slice(0, 10)
          : key === "tenantName"
          ? lease.tenant.fullname
          : key === "property"
          ? lease.listing.address
          : key === "rent"
          ? lease.bookingDetails.rentAmount
          : lease[key];

      if (editData[key] !== oldValue) changedFields[key] = editData[key];
    });

    if (Object.keys(changedFields).length === 0) return;
    onSubmit({ ...changedFields });
  };

  if (!lease) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-60 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg border border-gray-200"
          >
            {/* Header */}
            <div className="mb-6 text-center">
              <h3 className="text-2xl font-bold text-blue-800">
                {lease.tenant.fullname}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Lease ID: <span className="font-mono">{lease.leaseId}</span>
              </p>
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                  statusColors[lease.status] || "bg-gray-100 text-gray-700"
                }`}
              >
                {lease.status}
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tenant Name */}
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-1">
                    Tenant Name
                  </label>
                  <input
                    type="text"
                    name="tenantName"
                    value={editData.tenantName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl shadow-sm border-gray-300 focus:ring-2 focus:ring-blue-700 outline-none"
                  />
                </div>

                {/* Property */}
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-1">
                    Property
                  </label>
                  <input
                    type="text"
                    name="property"
                    value={editData.property}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl shadow-sm border-gray-300 focus:ring-2 focus:ring-blue-700 outline-none"
                  />
                </div>

                {/* Rent */}
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-1">
                    Rent Amount
                  </label>
                  <input
                    type="number"
                    name="rent"
                    value={editData.rent}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl shadow-sm border-gray-300 focus:ring-2 focus:ring-blue-700 outline-none"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-1">
                    Lease Status
                  </label>
                  <select
                    name="status"
                    value={editData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl shadow-sm border-gray-300 focus:ring-2 focus:ring-blue-700 outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Expired">Expired</option>
                    <option value="Expiring Soon">Expiring Soon</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="text"
                    name="startDate"
                    value={editData.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl shadow-sm border-gray-300 focus:ring-2 focus:ring-blue-700 outline-none"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="text"
                    name="endDate"
                    value={editData.endDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl shadow-sm border-gray-300 focus:ring-2 focus:ring-blue-700 outline-none"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 mt-4">
                <motion.button
                  type="button"
                  onClick={onClose}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={buttonHoverTransition}
                  className="px-5 py-2 rounded-xl font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 shadow"
                >
                  Cancel
                </motion.button>

                <motion.button
                  type="submit"
                  disabled={!hasChanges || isPending}
                  whileHover={hasChanges && !isPending ? { scale: 1.05 } : {}}
                  whileTap={hasChanges && !isPending ? { scale: 0.95 } : {}}
                  transition={buttonHoverTransition}
                  className={`px-5 py-2 rounded-xl font-semibold text-white shadow flex items-center justify-center gap-2 ${
                    !hasChanges || isPending
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-blue-700 hover:bg-blue-800"
                  }`}
                >
                  {isPending ? (
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
                    <>
                      <FaSave /> Save Changes
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
