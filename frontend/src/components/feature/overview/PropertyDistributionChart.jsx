import { useMemo } from "react";
import { motion } from "framer-motion";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";

// Register ChartJS components for Pie chart
ChartJS.register(Title, Tooltip, Legend, ArcElement);

export default function PropertyDistributionChart() {
    // Property Distribution Pie Chart Data
    const propertyData = useMemo(() => ({
        labels: ["Occupied", "Vacant", "Under Repair"],
        datasets: [
            {
            label: "Properties",
            data: [18, 6, 2], // example values
            backgroundColor: [
                "#93C5FD", // light blue - Occupied
                "#D1D5DB", // light gray - Vacant
                "#FCA5A5", // light red - Under Repair
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

    // Property Chart Options
    const propertyOptions = useMemo(
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
    );
}