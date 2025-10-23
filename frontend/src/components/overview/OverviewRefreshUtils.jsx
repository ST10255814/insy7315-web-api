/**
 * Overview refresh utilities
 * Provides a mobile-responsive refresh button for the overview dashboard
 */

import React from "react";
import { motion } from "framer-motion";
import { FaSyncAlt } from "react-icons/fa";
import { useInvalidateOverview } from "../../utils/queries";
import Toast from "../../lib/toast";

// Mobile-responsive refresh button component
export const OverviewRefreshButton = () => {
  const invalidateOverview = useInvalidateOverview();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Invalidate queries without showing toast
    invalidateOverview();
    
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
      className="group relative flex items-center gap-2 
                 p-2 sm:px-4 sm:py-2
                 bg-white/80 backdrop-blur-sm border border-white/20 text-blue-600 font-semibold 
                 rounded-full sm:rounded-2xl 
                 shadow-lg hover:shadow-xl hover:bg-white/90 
                 transition-all duration-300 disabled:opacity-70"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      title={isRefreshing ? "Refreshing..." : "Refresh Data"} // Tooltip for mobile
    >
      <motion.div
        animate={{ rotate: isRefreshing ? 360 : 0 }}
        transition={{
          duration: 1,
          repeat: isRefreshing ? Infinity : 0,
          ease: "linear",
        }}
      >
        <FaSyncAlt className="text-lg" />
      </motion.div>

      {/* Text only visible on larger screens */}
      <span className="hidden sm:block text-sm">
        {isRefreshing ? "Refreshing..." : "Refresh Data"}
      </span>

      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-full sm:rounded-2xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
    </motion.button>
  );
};
