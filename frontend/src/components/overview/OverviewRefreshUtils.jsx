/**
 * Example usage of manual overview invalidation
 * Use this pattern when you need to manually refresh overview data
 * after custom operations or external data changes.
 */

import React from "react";
import { motion } from "framer-motion";
import { FaSyncAlt } from "react-icons/fa";
import { useInvalidateOverview } from "../../utils/queries";
import Toast from "../../lib/toast";

export const useManualOverviewRefresh = () => {
  const invalidateOverview = useInvalidateOverview();

  const refreshOverviewData = React.useCallback((showToast = true) => {
    invalidateOverview();
    if (showToast) {
      Toast.success("Overview data refreshed!");
    }
  }, [invalidateOverview]);

  return refreshOverviewData;
};

// Refresh button component
export const OverviewRefreshButton = () => {
  const refreshOverview = useManualOverviewRefresh();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Refresh data without showing toast immediately
    refreshOverview(false);
    // Show animation for 1 second, then show toast and stop animation
    setTimeout(() => {
      setIsRefreshing(false);
      Toast.success("Overview data refreshed!");
    }, 1000);
  };

  return (
    <motion.button
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="group relative flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-white/20 text-blue-600 font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:bg-white/90 transition-all duration-300 disabled:opacity-70"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <motion.div
        animate={{ rotate: isRefreshing ? 360 : 0 }}
        transition={{
          duration: 1,
          repeat: isRefreshing ? Infinity : 0,
          ease: "linear"
        }}
      >
        <FaSyncAlt className="text-lg" />
      </motion.div>
      <span className="text-sm">
        {isRefreshing ? "Refreshing..." : "Refresh Data"}
      </span>
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
    </motion.button>
  );
};