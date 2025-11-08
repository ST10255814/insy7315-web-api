import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate, Routes, Route } from "react-router-dom";
import { useLeasesQuery } from "../../utils/queries";
import { FaPlusCircle } from "react-icons/fa";
import { TabWrapper, StateHandler, ActionButton, LeaseCard } from "../common/index.js";
import AddLease from "./lease/AddLease.jsx";
import DeleteLease from "./lease/DeleteLease.jsx";
import ViewLease from "./lease/ViewLease.jsx";
import DashboardNotFound from "../feature/DashboardNotFound.jsx";

export default function LeaseTab() {
  return (
    <Routes>
      <Route path="add" element={<AddLease />} />
      <Route path="delete/:leaseId" element={<DeleteLease />} />
      <Route path="view/:leaseId" element={<ViewLease />} />
      <Route index element={<LeaseListView />} />
      <Route path="*" element={<DashboardNotFound />} />
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
      case "Delete":
        navigate(`delete/${lease.leaseId}`);
        break;
      case "View":
        navigate(`view/${lease.leaseId}`);
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
