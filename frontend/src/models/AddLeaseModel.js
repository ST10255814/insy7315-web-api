import { motion, AnimatePresence } from "framer-motion";
import { FaPlusCircle } from "react-icons/fa";

export default function AddLeaseModal({ show, onClose, onSubmit, isPending, formData, setFormData }) {
  
  const buttonHoverTransition = { type: "spring", stiffness: 300, damping: 20 };

  const handleChange = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      errors: { ...formData.errors, [e.target.name]: false },
    });

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-60 flex items-center justify-center bg-gray-900/30 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-200"
          >
            <h3 className="text-2xl font-bold text-blue-800 mb-6 text-center">Add New Lease</h3>
            <form onSubmit={onSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">Booking ID</label>
                <input
                  type="text"
                  name="bookingID"
                  value={formData.bookingID}
                  onChange={handleChange}
                  placeholder="Enter Booking ID"
                  className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:ring-2 transition outline-none ${
                    formData.errors.isBookingId && !formData.bookingID
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-blue-700"
                  }`}
                />
                {formData.errors.isBookingId && (
                  <p className="text-red-500 text-sm mt-1 font-semibold">Booking ID is required</p>
                )}
              </div>

              <div className="flex justify-end gap-4 mt-2">
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
                  disabled={isPending}
                  whileHover={!isPending ? { scale: 1.05 } : {}}
                  whileTap={!isPending ? { scale: 0.95 } : {}}
                  transition={buttonHoverTransition}
                  className={`px-5 py-2 rounded-xl font-semibold text-white shadow flex items-center justify-center gap-2 ${
                    isPending ? "bg-blue-400 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-800"
                  }`}
                >
                  {isPending ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <FaPlusCircle /> Add Lease
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