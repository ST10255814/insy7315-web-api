import React from "react";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";

import StatsCardContainer from "./overview/StatsCardContainer";
import ActivityFeed from "./overview/ActivityFeed";
import ChartContainer from "./overview/ChartContainer";
import { OverviewRefreshButton } from "./overview/OverviewRefreshUtils";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

export default function OverviewTab() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-8 relative"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 right-1/4 w-40 h-40 bg-gradient-to-br from-blue-100/40 to-purple-100/30 rounded-full blur-3xl -z-10 animate-float"></div>
      <div
        className="absolute top-1/3 left-1/4 w-32 h-32 bg-gradient-to-br from-green-100/30 to-blue-100/20 rounded-full blur-2xl -z-10"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute bottom-1/4 right-1/3 w-28 h-28 bg-gradient-to-br from-orange-100/25 to-pink-100/20 rounded-full blur-2xl -z-10 animate-float"
        style={{ animationDelay: "4s" }}
      ></div>

      {/* Stats Cards with Refresh Button */}
      <div className="space-y-4">
        {/* Section Header with Refresh Button */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-2xl font-extrabold text-blue-700">
            Dashboard Overview
          </h2>
          <OverviewRefreshButton />
        </motion.div>

        <StatsCardContainer />
      </div>

      {/* Charts */}
      <ChartContainer />

      {/* Recent Activity */}
      <ActivityFeed />
    </motion.div>
  );
}
