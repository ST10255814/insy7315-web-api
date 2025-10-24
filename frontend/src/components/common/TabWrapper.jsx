import { motion } from "framer-motion";

/**
 * Universal wrapper for dashboard tab content with consistent animations
 * and background decorative elements
 */
export default function TabWrapper({ 
  children, 
  className = "",
  decorativeElements = "default" // "default", "blue-green", "blue-purple", "purple-green", "none"
}) {
  // Different decorative element configurations
  const decorativeConfigs = {
    default: (
      <>
        <div className="absolute top-0 right-1/4 w-32 h-32 bg-gradient-to-br from-blue-100/30 to-green-100/20 rounded-full blur-3xl -z-10 animate-float"></div>
        <div className="absolute bottom-1/3 left-1/4 w-28 h-28 bg-gradient-to-br from-purple-100/25 to-blue-100/15 rounded-full blur-2xl -z-10" style={{animationDelay: '2s'}}></div>
      </>
    ),
    "blue-green": (
      <>
        <div className="absolute top-0 right-1/4 w-32 h-32 bg-gradient-to-br from-blue-100/30 to-green-100/20 rounded-full blur-3xl -z-10 animate-float"></div>
        <div className="absolute bottom-1/3 left-1/4 w-28 h-28 bg-gradient-to-br from-purple-100/25 to-blue-100/15 rounded-full blur-2xl -z-10" style={{animationDelay: '2s'}}></div>
      </>
    ),
    "blue-purple": (
      <>
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-100/30 to-purple-100/20 rounded-full blur-3xl -z-10 animate-float"></div>
        <div className="absolute bottom-1/3 right-1/4 w-28 h-28 bg-gradient-to-br from-green-100/25 to-blue-100/15 rounded-full blur-2xl -z-10" style={{animationDelay: '3s'}}></div>
      </>
    ),
    "purple-green": (
      <>
        <div className="absolute top-0 left-1/3 w-32 h-32 bg-gradient-to-br from-purple-100/30 to-green-100/20 rounded-full blur-3xl -z-10 animate-float"></div>
        <div className="absolute bottom-1/4 right-1/3 w-28 h-28 bg-gradient-to-br from-blue-100/25 to-purple-100/15 rounded-full blur-2xl -z-10" style={{animationDelay: '1.5s'}}></div>
      </>
    ),
    none: null
  };

  return (
    <motion.div
      className={`w-full space-y-6 relative ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background decorative elements */}
      {decorativeConfigs[decorativeElements]}
      
      {children}
    </motion.div>
  );
}