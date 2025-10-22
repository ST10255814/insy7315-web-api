import { motion } from "framer-motion";
import MaintenanceColumn from "../pages/MaintenanceColumn.jsx";
import LoadingSkeleton from "../pages/LoadingSkeleton.jsx";
import { useState, useEffect } from "react";

export default function MaintenanceTab() {
  // Simulate loading
  const [isLoading, setIsLoading] = useState(true);
  const [maintenanceData, setMaintenanceData] = useState([]);

  useEffect(() => {
    // Temp maintenance data
    const tempMaintenance = [
      {
        title: "Heating Issue",
        description: "The heating system is not working in the living room.",
        property: "Unit 4A",
        tenant: "Sarah Johnson",
        caretaker: "Bob Wilson",
        status: "Pending",
        priority: "High",
        followUps: 0,
        notes: "",
        updatedAt: "2025-10-12",
      },
      {
        title: "Leaky Faucet",
        description: "Kitchen faucet leaks continuously, water waste is high.",
        property: "Unit 12B",
        tenant: "Alice Brown",
        caretaker: "Mike Johnson",
        status: "In Progress",
        priority: "Medium",
        followUps: 3,
        notes: "Started yesterday",
        updatedAt: "2025-10-11",
      },
      {
        title: "Broken Window",
        description: "Living room window shattered, needs replacement.",
        property: "Unit 3D",
        tenant: "Mark Lee",
        caretaker: "Steve Smith",
        status: "Completed",
        priority: "Low",
        followUps: 0,
        notes: "Replaced glass",
        updatedAt: "2025-10-10",
      },
      {
        title: "Clogged Drain",
        description: "Bathroom drain is blocked and slow draining.",
        property: "Unit 8A",
        tenant: "Mary Jane",
        caretaker: "Bob Wilson",
        status: "Pending",
        priority: "Medium",
        followUps: 0,
        notes: "",
        updatedAt: "2025-10-12",
      },
    ];

    const timer = setTimeout(() => {
      setMaintenanceData(tempMaintenance);
      setIsLoading(false);
    }, 3000); // simulate 3s API delay

    return () => clearTimeout(timer);
  }, []);

  const statuses = ["Pending", "In Progress", "Completed"];

  return (
    <motion.div className="space-y-6 overflow-hidden max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading
          ? Array(6)
              .fill(0)
              .map((_, i) => <LoadingSkeleton key={i} />)
          : statuses.map((status) => {
              const requests = maintenanceData?.filter((m) => m.status === status) || [];
              return <MaintenanceColumn key={status} status={status} requests={requests} />;
            })}
      </div>
    </motion.div>
  );
}
