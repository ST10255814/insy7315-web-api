import { motion } from "framer-motion";
import RevenueChart from "./RevenueChart";
import PropertyDistributionChart from "./PropertyDistributionChart";

export default function ChartContainer() {
    return (
        <motion.div
            className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
        >
            <RevenueChart />
            <PropertyDistributionChart />
        </motion.div>
    );
};