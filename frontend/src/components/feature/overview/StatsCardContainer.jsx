import { motion } from "framer-motion";
import {
  FaHome,
  FaMoneyBillWave,
  FaClipboardList,
  FaWrench,
} from "react-icons/fa";
import StatsCard from "../../common/StatsCard";
import { 
  useMonthlyRevenueQuery,
  useTotalPropertiesCountQuery,
  useMonthlyPropertiesCountQuery,
  useActiveLeasesCountQuery,
  useLeasedPercentageQuery,
  useMaintenanceCountQuery,
  useHighPriorityMaintenanceCountQuery,
} from "../../../utils/queries";
import { useParams } from "react-router-dom";

export default function StatsCardContainer() {
  const { userId: adminId } = useParams();
  // Fetch all data with React Query hooks
  const { data: monthlyRevenue, isLoading: revenueLoading, isError: revenueError } = useMonthlyRevenueQuery(adminId);
  const { data: totalProperties, isLoading: totalPropertiesLoading, isError: totalPropertiesError } = useTotalPropertiesCountQuery(adminId);
  const { data: monthlyProperties, isLoading: monthlyPropertiesLoading, isError: monthlyPropertiesError } = useMonthlyPropertiesCountQuery(adminId);
  const { data: activeLeases, isLoading: leasesLoading, isError: leasesError } = useActiveLeasesCountQuery(adminId);
  const { data: leasedPercentage, isLoading: percentageLoading, isError: percentageError } = useLeasedPercentageQuery(adminId);
  const { data: maintenanceCount, isLoading: maintenanceLoading, isError: maintenanceError } = useMaintenanceCountQuery(adminId);
  const { data: highPriorityCount, isLoading: highPriorityLoading, isError: highPriorityError } = useHighPriorityMaintenanceCountQuery(adminId);

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const statsCardsConfig = [
    {
      title: "Total Properties",
      value: totalPropertiesLoading 
        ? "Loading..." 
        : totalPropertiesError 
          ? "Error" 
          : totalProperties?.toString() || "0",
      subtitle: monthlyPropertiesLoading 
        ? "Fetching data..." 
        : monthlyPropertiesError 
          ? "Failed to load" 
          : monthlyProperties > 0 
            ? `↗ +${monthlyProperties} this month`
            : "No new properties this month",
      color: "blue",
      icon: <FaHome />
    },
    {
      title: "Monthly Revenue",
      value: revenueLoading 
        ? "Loading..." 
        : revenueError 
          ? "Error" 
          : formatCurrency(monthlyRevenue?.totalRevenue || 0),
      subtitle: revenueLoading 
        ? "Fetching data..." 
        : revenueError 
          ? "Failed to load" 
          : `${monthlyRevenue?.month || ''} ${monthlyRevenue?.year || ''}`,
      color: "green",
      icon: <FaMoneyBillWave />
    },
    {
      title: "Active Leases",
      value: leasesLoading 
        ? "Loading..." 
        : leasesError 
          ? "Error" 
          : activeLeases?.toString() || "0",
      subtitle: percentageLoading 
        ? "Calculating..." 
        : percentageError 
          ? "Failed to load" 
          : `${leasedPercentage.toFixed(0) || 0}% occupancy`,
      color: "purple",
      icon: <FaClipboardList />
    },
    {
      title: "Pending Tasks",
      value: maintenanceLoading 
        ? "Loading..." 
        : maintenanceError 
          ? "Error" 
          : maintenanceCount?.toString() || "0",
      subtitle: highPriorityLoading 
        ? "Calculating..." 
        : highPriorityError 
          ? "Failed to load" 
          : `${highPriorityCount || 0} urgent items`,
      color: "orange",
      icon: <FaWrench />
    }
  ];

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      {statsCardsConfig.map((card, index) => (
        <StatsCard
          key={index}
          title={card.title}
          value={card.value}
          subtitle={card.subtitle}
          color={card.color}
          icon={card.icon}
        />
      ))}
    </motion.div>
  );
};