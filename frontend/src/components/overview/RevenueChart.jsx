import React from "react";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";

const RevenueChart = () => {
  // Revenue Line Chart Data
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

  // Revenue Chart Options
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

  return (
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
  );
};

export default RevenueChart;