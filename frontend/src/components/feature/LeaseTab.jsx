import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate, Routes, Route } from "react-router-dom";
import { useLeasesQuery } from "../../utils/queries";
import { FaPlusCircle } from "react-icons/fa";
import { TabWrapper, StateHandler, ActionButton, LeaseCard } from "../common/index.js";
import Toast from "../../lib/toast.js";
import AddLease from "./lease/AddLease.jsx";

export default function LeaseTab() {
  return (
    <Routes>
      <Route path="add" element={<AddLease />} />
      <Route index element={<LeaseListView />} />
    </Routes>
  );
}

function LeaseListView() {
  const { userId: adminId } = useParams();
  const { isLoading, isError, data: leases = [] } = useLeasesQuery(adminId);
  const navigate = useNavigate();

  // Handle Lease Actions
  const handleLeaseAction = (action, lease) => {
    switch (action) {
      case "Edit":
        //TODO: Implement edit functionality
        Toast.info(`Editing lease ${lease.leaseId}`);
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
          onClick={() => navigate(`add`)}
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
    </TabWrapper>
  );
}
