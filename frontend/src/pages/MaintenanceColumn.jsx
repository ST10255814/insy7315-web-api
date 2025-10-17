import { motion } from "framer-motion";
import MaintenanceCard from "./MaintenanceCard.jsx";

const statusMap = {
  Pending: { label: "Unassigned", color: "text-red-600" },
  "In Progress": { label: "In Progress", color: "text-yellow-600" },
  Completed: { label: "Completed", color: "text-green-600" },
};

const columnVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function MaintenanceColumn({ status, requests }) {
  return (
    <motion.div
      className="space-y-4"
      initial="hidden"
      animate="visible"
      variants={columnVariants}
    >
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`text-lg font-bold flex items-center gap-3 ${statusMap[status].color}`}
      >
        {statusMap[status].label} ({requests.length})
      </motion.h2>

      <div className="space-y-4">
        {requests.length === 0 ? (
          <p className="text-gray-400 italic">No requests</p>
        ) : (
          requests.map((req, i) => <MaintenanceCard key={i} request={req} />)
        )}
      </div>
    </motion.div>
  );
}