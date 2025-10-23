import { motion } from "framer-motion";
import { useScrollAnimation } from "../../hooks/useScrollAnimation.js";

/**
 * Shared layout component for authentication pages (login/register)
 * @param {Object} props
 * @param {React.ReactNode} props.children - Form content
 * @param {String} props.title - Page title
 * @param {String} props.subtitle - Page subtitle
 * @param {Boolean} props.isShaking - Whether to apply shake animation
 * @param {String} props.containerClassName - Additional classes for container
 */
export default function AuthLayout({
  children,
  title,
  subtitle,
  isShaking = false,
  containerClassName = ""
}) {
  const { getParallaxStyle, getReverseParallaxStyle, offsetY } = useScrollAnimation();

  const shakeAnimation = {
    x: [0, -10, 10, -8, 8, -5, 5, 0],
    transition: { duration: 0.6, ease: "easeInOut" },
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 overflow-hidden">
      {/* Background decorative elements */}
      <div 
        className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-200/20 rounded-full blur-3xl animate-float"
        style={getParallaxStyle(0.3)}
      />
      <div 
        className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-100/40 to-cyan-100/30 rounded-full blur-3xl"
        style={getReverseParallaxStyle(0.2)}
      />
      <div 
        className="absolute top-1/2 left-1/3 w-40 h-40 bg-gradient-to-br from-purple-100/25 to-pink-100/15 rounded-full blur-2xl animate-float"
        style={{ 
          animationDelay: '2s',
          transform: `translateY(${offsetY * 0.1}px)` 
        }}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={
          isShaking
            ? { ...shakeAnimation, opacity: 1, y: 0, scale: 1 }
            : { opacity: 1, y: 0, scale: 1 }
        }
        transition={{ duration: 1 }}
        className={`backdrop-blur-lg bg-white/85 rounded-3xl shadow-2xl border border-white/30 p-4 sm:p-6 text-center relative z-10 ${containerClassName}`}
      >
        {/* Subtle card background gradient */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100/20 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-br from-purple-100/15 to-transparent rounded-full blur-xl" />
        
        {/* Header */}
        <div className="mb-4 sm:mb-6 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl sm:text-3xl font-bold text-blue-700"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Form content */}
        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    </div>
  );
}