import { motion } from "framer-motion";
import MaintenanceCard from "./MaintenanceCard.jsx";
import { maintenanceStatusMap } from "../../../constants/constants.js";

const columnVariants = {
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function MaintenanceColumn({ status, requests, onAction }) {
  return (
    <motion.div
      className="flex flex-col h-auto md:h-full w-full max-w-full"
      initial="hidden"
      animate="visible"
      variants={columnVariants}
    >
      {/* Fixed Header */}
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`text-base sm:text-lg font-bold flex items-center gap-2 sm:gap-3 mb-1 flex-shrink-0 ${maintenanceStatusMap[status].color}`}
      >
        {maintenanceStatusMap[status].label} ({requests.length})
      </motion.h2>

      {/* Content - Mobile: no scroll, Desktop: scrollable */}
      <div className="flex-1 overflow-visible md:overflow-y-auto md:pr-2 space-y-2 sm:space-y-3 pb-2">
        {requests.length === 0 ? (
          <div className="flex items-center justify-center h-24 sm:h-32">
            <p className="text-gray-400 italic text-center text-xs sm:text-sm">
              No {maintenanceStatusMap[status].label.toLowerCase()} requests
            </p>
          </div>
        ) : (
          requests.map((req, i) => (
            <MaintenanceCard
              key={req.maintenanceID}
              request={req}
              onAction={onAction}
            />
          ))
        )}
      </div>
    </motion.div>
  );
}