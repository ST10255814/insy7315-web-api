import { motion } from "framer-motion";

export default function ChartLoading( {subtitle} ) {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <div className="relative">
        {/* Outer rotating ring */}
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
        {/* Inner pulsing dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-3 w-3 bg-blue-600 rounded-full animate-pulse"></div>
        </div>
        {/* Animated border */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
      </div>
      {/* Loading text with typing animation */}
      <div className="text-center">
        <motion.p
          className="text-blue-600 font-medium text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          {subtitle}
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ...
          </motion.span>
        </motion.p>
        {/* Animated progress bars */}
        <div className="mt-3 space-y-2 w-32">
          <motion.div
            className="h-1 bg-blue-100 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <motion.div
              className="h-full bg-blue-500 rounded-full"
              animate={{
                x: ["-100%", "100%"],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
          <motion.div
            className="h-1 bg-blue-50 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
            <motion.div
              className="h-full bg-blue-300 rounded-full"
              animate={{
                x: ["-100%", "100%"],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.3,
              }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
