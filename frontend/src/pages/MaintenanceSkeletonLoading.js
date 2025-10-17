import { motion } from "framer-motion";

export default function LoadingSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden bg-gray-100 rounded-3xl h-48"
    >
      {/* Shimmer overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100
                   bg-[length:200%_100%] animate-shimmer"
      />
    </motion.div>
  );
}
