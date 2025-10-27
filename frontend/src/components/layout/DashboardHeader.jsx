import { motion } from "framer-motion";

export default function DashboardHeader({ currentTab }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-2">
          {currentTab.label}
        </h1>
        <p className="text-gray-600">{currentTab.description}</p>
      </div>
    </motion.div>
  );
}