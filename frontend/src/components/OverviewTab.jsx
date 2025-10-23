import React from "react";
import { motion } from "framer-motion";
import { Line, Pie } from "react-chartjs-2";
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
  // Revenue Line Chart
  const revenueData = React.useMemo(
    () => ({
      labels: ["Jan", "Feb", "Mar", "Apr", "May"],
      datasets: [
        {
          label: "Revenue (R)",
          data: [80000, 92000, 88000, 99000, 91250],
          fill: true,
          backgroundColor: function (context) {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return null;
            const gradient = ctx.createLinearGradient(
              0,
              chartArea.top,
              0,
              chartArea.bottom
            );
            gradient.addColorStop(0, "rgba(59,130,246,0.5)"); // blue-500
            gradient.addColorStop(1, "rgba(59,130,246,0.05)");
            return gradient;
          },
          borderColor: "rgba(59,130,246,1)",
          tension: 0.4,
          pointRadius: 6,
          pointBackgroundColor: "rgba(59,130,246,1)",
        },
      ],
    }),
    []
  );

  const revenueOptions = React.useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { mode: "index", intersect: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 20000 },
          grid: { drawBorder: false, color: "rgba(0,0,0,0.05)" },
        },
        x: {
          grid: { drawBorder: false, color: "rgba(0,0,0,0.05)" },
        },
      },
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        }
      },
    }),
    []
  );

  // Property Distribution Pie Chart
  const propertyData = React.useMemo(
    () => ({
      labels: ["Occupied", "Vacant", "Under Repair", "Reserved"],
      datasets: [
        {
          label: "Properties",
          data: [18, 6, 2, 3], // example values
          backgroundColor: [
            "#93C5FD", // light blue - Occupied
            "#D1D5DB", // light gray - Vacant
            "#FCA5A5", // light red - Under Repair
            "#FDBA74", // light red - Reserved
          ],
          borderColor: "#ffffff", // white separation between slices
          borderWidth: 2,
          borderRadius: 10,
          spacing: 4, // space between slices
        },
      ],
    }),
    []
  );

  const propertyOptions = React.useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 20,
            padding: 15,
            color: "#374151", // text-gray-700
            font: { size: 14, weight: "500" },
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.label}: ${context.raw} units`;
            },
          },
        },
      },
      animation: {
        animateRotate: true,
        animateScale: true,
      },
    }),
    []
  );
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-8 relative"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 right-1/4 w-40 h-40 bg-gradient-to-br from-blue-100/40 to-purple-100/30 rounded-full blur-3xl -z-10 animate-float"></div>
      <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-gradient-to-br from-green-100/30 to-blue-100/20 rounded-full blur-2xl -z-10" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-1/4 right-1/3 w-28 h-28 bg-gradient-to-br from-orange-100/25 to-pink-100/20 rounded-full blur-2xl -z-10 animate-float" style={{animationDelay: '4s'}}></div>
      
      {/* Stats Cards with Refresh Button */}
      <div className="space-y-4">
        {/* Section Header with Refresh Button */}
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-2xl font-extrabold text-blue-700">Dashboard Overview</h2>
          <OverviewRefreshButton />
        </motion.div>
        
        <StatsCardContainer />
      </div>

      {/* Charts */}
      <motion.div 
        className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {/* Revenue Trend */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 relative overflow-hidden"
          whileHover={{ scale: 1.03, boxShadow: "0 15px 35px rgba(0,0,0,0.15)" }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100/30 to-transparent rounded-full blur-2xl"></div>
          <h3 className="text-xl font-bold text-blue-600 mb-4 px-6 pt-6 relative z-10">
            Revenue Trend
          </h3>
          <div className="h-80 relative z-10 pl-6 pr-6 pb-6">
            <Line data={revenueData} options={revenueOptions} />
          </div>
        </motion.div>

        {/* Property Distribution */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-white/20 relative overflow-hidden"
          whileHover={{ scale: 1.03, boxShadow: "0 15px 35px rgba(0,0,0,0.15)" }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-purple-100/30 to-transparent rounded-full blur-2xl"></div>
          <h3 className="text-xl font-bold text-blue-600 mb-4 relative z-10">
            Property Distribution
          </h3>
          <div className="h-80 flex items-center justify-center relative z-10">
            <Pie data={propertyData} options={propertyOptions} />
          </div>
        </motion.div>
      </motion.div>

      {/* Recent Activity */}
      <ActivityFeed />
    </motion.div>
  );
}