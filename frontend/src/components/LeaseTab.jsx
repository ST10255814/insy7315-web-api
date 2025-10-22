import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import { useLeasesQuery, useCreateLeaseMutation } from "../utils/queries";
import { FaPlusCircle } from "react-icons/fa";
import LeaseCard from "../pages/LeaseCard.jsx";
import LoadingSkeleton from "../pages/LoadingSkeleton.jsx";
import AddLeaseModal from "../models/AddLeaseModel.jsx";
import EditLeaseModal from "../models/EditLeaseModel.jsx";
import Toast from "../lib/toast.js";

export default function LeasesTab() {
  const { userId: adminId } = useParams();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLease, setSelectedLease] = useState(null);
  const [formData, setFormData] = useState({
    bookingID: "",
    errors: { isBookingId: false },
  });

  const { isLoading, isError, data: leases } = useLeasesQuery(adminId);
  const createLeaseMutation = useCreateLeaseMutation();

  // Add Lease Submit
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.bookingID) {
      setFormData({ ...formData, errors: { isBookingId: true } });
      return;
    }
    createLeaseMutation.mutate(formData.bookingID, {
      onSuccess: () => {
        setShowAddModal(false);
        setFormData({
          bookingID: "",
          errors: { isBookingId: false },
        });
      },
      onError: () =>
        setFormData((prev) => ({ ...prev, errors: { isBookingId: true } })),
    });
  };

  // Edit Lease Submit
  const handleEditSubmit = () => {
    if (!selectedLease) return;
    Toast.info(`Updating lease ${selectedLease.leaseId}...`);
    setShowEditModal(false);
    setSelectedLease(null);
  };

  // Handle Lease Actions
  const handleLeaseAction = (action, lease) => {
    switch (action) {
      case "Edit":
        //TODO: Implement edit functionality
        setSelectedLease(lease);
        setShowEditModal(true);
        break;
      case "Delete":
        //TODO: Implement delete functionality
        Toast.warning(`Deleting lease ${lease.leaseId}`);
        break;
      case "Activate":
        //TODO: Implement activate functionality
        Toast.info(`Activating lease ${lease.leaseId}`);
        break;
      case "Cancel":
        //TODO: Implement cancel functionality
        Toast.warning(`Cancelling lease ${lease.leaseId}`);
        break;
      case "Renew":
        //TODO: Implement renew functionality
        Toast.info(`Renewing lease ${lease.leaseId}`);
        break;
      default:
        break;
    }
  };

  return (
    <motion.div
      className="w-full space-y-6 relative"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 left-1/4 w-36 h-36 bg-gradient-to-br from-green-100/30 to-blue-100/20 rounded-full blur-3xl -z-10 animate-float"></div>
      <div className="absolute bottom-1/4 right-1/3 w-28 h-28 bg-gradient-to-br from-purple-100/25 to-pink-100/15 rounded-full blur-2xl -z-10" style={{animationDelay: '3s'}}></div>
      
      {/* Add Lease Button */}
      <div className="flex justify-start">
        <motion.button
        onClick={() => setShowAddModal(true)}
        whileHover={{
          scale: 1.07,
          boxShadow: "0 8px 25px rgba(59,130,246,0.45)",
        }}
        whileTap={{ scale: 0.96 }}
        transition={{
          type: "spring",
          stiffness: 220,
          damping: 18,
          mass: 0.8,
        }}
        disabled={isLoading}
        className="flex items-center justify-center gap-2
            bg-gradient-to-r from-blue-500 to-blue-600
          text-white px-6 py-3 rounded-2xl shadow-md
            font-semibold text-md
          hover:from-blue-600 hover:to-blue-700
            transition-all duration-300 ease-out
            focus:outline-none focus:ring-4 focus:ring-blue-300"
      >
        <FaPlusCircle className="text-lg" />
        Add Lease
      </motion.button>
      </div>

      {/* Lease Cards / Loading / Error */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <LoadingSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && (
        <div className="text-red-600 font-semibold text-center mt-10">
          Failed to load leases. Please try again.
        </div>
      )}

      {leases && leases?.length === 0 && (
        <div className="text-gray-500 text-center mt-10 font-medium">
          No leases found. Add a new lease to get started.
        </div>
      )}

      {leases && leases?.length > 0 && (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <AnimatePresence>
            {leases.map((lease, index) => (
              <motion.div
                key={lease._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <LeaseCard
                  lease={lease}
                  onAction={handleLeaseAction}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Add Lease Modal */}
      <AddLeaseModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddSubmit}
        isPending={createLeaseMutation.isPending}
        formData={formData}
        setFormData={setFormData}
      />

      {/* Edit Lease Modal */}
      <EditLeaseModal
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedLease(null);
        }}
        lease={selectedLease}
        onSubmit={handleEditSubmit}
        setSelectedLease={setSelectedLease}
      />
    </motion.div>
  );
}
