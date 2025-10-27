import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import { useLeasesQuery, useCreateLeaseMutation } from "../../utils/queries";
import { FaPlusCircle } from "react-icons/fa";
import { TabWrapper, StateHandler, ActionButton, LeaseCard } from "../common/index.js";
import AddLeaseModal from "../../models/AddLeaseModel.jsx";
import EditLeaseModal from "../../models/EditLeaseModel.jsx";
import Toast from "../../lib/toast.js";

export default function LeasesTab() {
  const { userId: adminId } = useParams();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLease, setSelectedLease] = useState(null);
  const [formData, setFormData] = useState({
    bookingID: "",
    errors: { isBookingId: false },
  });

  const { isLoading, isError, data: leases = [] } = useLeasesQuery(adminId);
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
    <TabWrapper decorativeElements="purple-green">
      {/* Add Lease Button */}
      <div className="flex justify-start">
        <ActionButton
          onClick={() => setShowAddModal(true)}
          icon={FaPlusCircle}
          disabled={isLoading}
          size="medium"
        >
          Add Lease
        </ActionButton>
      </div>

      <StateHandler
        isLoading={isLoading}
        isError={isError}
        data={leases}
        errorMessage="Failed to load leases. Please try again."
        emptyMessage="No leases found. Add a new lease to get started."
        gridCols="grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
        loadingCount={8}
      >
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <AnimatePresence>
            {(leases || []).map((lease, index) => (
              <motion.div
                key={lease.leaseId}
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
      </StateHandler>

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
    </TabWrapper>
  );
}
