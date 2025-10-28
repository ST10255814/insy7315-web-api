import { motion } from "framer-motion";

export default function DeletePropertyLoading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-16 h-16 border-4 border-blue-300 border-t-blue-600 rounded-full mb-4"
        style={{ borderTopColor: "#2563eb" }}
      />
      <span className="text-blue-600 font-semibold text-lg">Loading property details...</span>
    </motion.div>
  );
}
