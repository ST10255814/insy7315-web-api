import { useMemo } from "react";
import { motion } from "framer-motion";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { useAdminPropertiesStatusQuery } from "../../../utils/queries";
import { useParams } from "react-router-dom";
import { ChartLoading, ChartError } from "../../common/index.js";

// Register ChartJS components for Pie chart
ChartJS.register(Title, Tooltip, Legend, ArcElement);

export default function PropertyDistributionChart() {
    const { userId: adminId } = useParams();
    // Property Status Query
    const { data: propertyStatusData, isLoading, isError } = useAdminPropertiesStatusQuery(adminId);

    // Property Distribution Pie Chart Data
    const propertyData = useMemo(() => {
        if (!propertyStatusData) {
            return {
                labels: [],
                datasets: [
                    {
                        label: "Properties",
                        data: [],
                        backgroundColor: [],
                        borderColor: "#ffffff",
                        borderWidth: 2,
                        borderRadius: 10,
                        spacing: 2,
                    },
                ],
            };
        }

        return {
            labels: ["Occupied", "Vacant", "Under Maintenance"],
            datasets: [
                {
                    label: "Properties",
                    data: [
                        propertyStatusData.activeBookings || 0,
                        propertyStatusData.vacant || 0,
                        propertyStatusData.underMaintenance || 0
                    ],
                    backgroundColor: [
                        "#93C5FD", // light blue - Occupied
                        "#D1D5DB", // light gray - Vacant
                        "#FCA5A5", // light red - Under Maintenance
                    ],
                    borderColor: "#ffffff", // white separation between slices
                    borderWidth: 2,
                    borderRadius: 10,
                    spacing: 1, // no space between slices
                },
            ],
        };
    }, [propertyStatusData]);

    // Property Chart Options
    const propertyOptions = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
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
                            return `${context.label}: ${context.raw} ${context.raw === 1 ? 'property' : 'properties'}`;
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
                {isLoading ? (
                    <ChartLoading
                        subtitle="Loading property status data"
                    />
                ) : isError ? (
                    <ChartError
                    message="Failed to load property status data"
                    />
                ) : !propertyStatusData || (propertyStatusData.activeBookings === 0 && propertyStatusData.vacant === 0 && propertyStatusData.underMaintenance === 0) ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <div className="text-gray-400 text-lg mb-2">🏠</div>
                            <p className="text-gray-600">No property data available</p>
                        </div>
                    </div>
                ) : (
                    <Pie data={propertyData} options={propertyOptions} />
                )}
            </div>
        </motion.div>
    );
}