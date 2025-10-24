import { motion } from "framer-motion";

/**
 * Animated section heading component with consistent styling
 */
export default function SectionHeading({ 
  title, 
  className = "",
  delay = 0.1 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={`relative z-10 ${className}`}
    >
      <h2 className="text-2xl font-extrabold text-blue-700 mb-6">{title}</h2>
    </motion.div>
  );
}