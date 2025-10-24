import { motion } from "framer-motion";

/**
 * Enhanced branded loading fallback for lazy-loaded components
 * Provides a professional, branded loading experience with smooth animations
 */
export default function EnhancedBrandedFallback() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex items-center justify-center z-50">
      <div className="flex flex-col items-center justify-center space-y-6">
        {/* Logo/Brand Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-blue-700 mb-2">RentWise</h1>
          <p className="text-gray-600 text-sm">Property Management System</p>
        </motion.div>

        {/* Animated Loading Spinner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative"
        >
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          
          {/* Pulsing background circle */}
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 w-16 h-16 border-2 border-blue-300/30 rounded-full"
          />
        </motion.div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center"
        >
          <p className="text-gray-700 font-medium">Loading...</p>
          <p className="text-gray-500 text-sm mt-1">Please wait while we prepare your content</p>
        </motion.div>

        {/* Animated dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex space-x-2"
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut"
              }}
              className="w-2 h-2 bg-blue-500 rounded-full"
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}