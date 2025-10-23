import React from "react";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { useRevenueTrendQuery } from "../../utils/queries";
import { useParams } from "react-router-dom";

// Register ChartJS components for Line chart
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const assignLabels = (data) => {
    return data.map(item => item.monthName.substring(0, 3)); // Use first 3 letters of month name
}

export default function RevenueChart() {
    const { userId: adminId } = useParams();
    const { data: revenueTrend, isLoading, isError } = useRevenueTrendQuery(adminId);
    
    // Revenue Line Chart Data
    const revenueData = React.useMemo(
        () => {
            if (!revenueTrend || revenueTrend.length === 0) {
                return {
                    labels: [],
                    datasets: [{
                        label: "Revenue (R)",
                        data: [],
                        fill: true,
                        backgroundColor: "rgba(59,130,246,0.1)",
                        borderColor: "rgba(59,130,246,1)",
                        tension: 0.4,
                        pointRadius: 6,
                        pointBackgroundColor: "rgba(59,130,246,1)",
                    }]
                };
            }

            return {
                labels: assignLabels(revenueTrend),
                datasets: [
                    {
                        label: "Revenue (R)",
                        data: revenueTrend.map(item => item.totalRevenue),
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
            };
        },
        [revenueTrend]
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
            bottom: 0,
            },
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
                Revenue Trend - {revenueTrend ? revenueTrend[revenueTrend.length - 1].year : ''}
            </h3>
            <div className="h-80 relative z-10 pl-6 pr-6 pb-6">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : isError ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <div className="text-red-500 text-lg mb-2">⚠️</div>
                            <p className="text-gray-600">Failed to load revenue data</p>
                        </div>
                    </div>
                ) : !revenueTrend || revenueTrend.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <div className="text-gray-400 text-lg mb-2">📊</div>
                            <p className="text-gray-600">No revenue data available</p>
                        </div>
                    </div>
                ) : (
                    <Line data={revenueData} options={revenueOptions} />
                )}
            </div>
        </motion.div>
    );
};