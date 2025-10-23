import React from "react";
import { motion } from "framer-motion";
import { useRecentActivitiesQuery } from "../../utils/queries";
import { getActivityColor, formatActivityTime } from "../../utils/activityHelpers";
import { useParams } from "react-router-dom";

export default function ActivityFeed() {
  const { userId: adminId } = useParams();
  const { data: activities, isLoading, isError } = useRecentActivitiesQuery(adminId);

  // Generate activity items based on the query state
  const activityItems = React.useMemo(() => {
    if (isLoading) {
      return [
        {
          color: "#6B7280", // gray-500
          bgColor: "rgba(107, 114, 128, 0.1)",
          title: "Loading activities...",
          subtitle: "Please wait while we fetch your recent activities",
        },
      ];
    }

    if (isError) {
      return [
        {
          color: "#EF4444", // red-500
          bgColor: "rgba(239, 68, 68, 0.1)",
          title: "Failed to load activities",
          subtitle: "Unable to fetch recent activities",
        },
      ];
    }

    if (!activities || activities.length === 0) {
      return [
        {
          color: "#6B7280", // gray-500
          bgColor: "rgba(107, 114, 128, 0.1)",
          title: "No recent activities",
          subtitle: "Your recent activities will appear here",
        },
      ];
    }

    return activities.map(activity => {
      const colors = getActivityColor(activity.action);
      return {
        color: colors.color,
        bgColor: colors.bgColor,
        title: activity.detail || activity.action,
        subtitle: formatActivityTime(activity.timestamp),
      };
    });
  }, [activities, isLoading, isError]);

  return (
    <motion.div
      className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 border border-white/20 relative overflow-hidden"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
    >
      <div className="absolute top-0 left-1/2 w-24 h-24 bg-gradient-to-br from-green-100/20 to-transparent rounded-full blur-2xl"></div>
      <h3 className="text-xl font-bold text-blue-600 mb-4 relative z-10">
        Recent Activity
      </h3>
      <div className="space-y-4 relative z-10">
        {activityItems.map((item, i) => (
          <motion.div
            key={i}
            className="flex items-center space-x-4 p-4 rounded-2xl cursor-pointer hover:shadow-md backdrop-blur-sm border border-white/10"
            style={{ backgroundColor: item.bgColor }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            whileInView={{ transition: { delay: i * 0.1 } }}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            ></div>
            <div>
              <p className="font-semibold text-gray-800">{item.title}</p>
              <p className="text-gray-600 text-sm">{item.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};