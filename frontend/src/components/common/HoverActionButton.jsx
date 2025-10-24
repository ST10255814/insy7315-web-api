import { motion } from "framer-motion";

/**
 * Reusable hover action button with tooltip
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.icon - The icon to display in the button
 * @param {string} props.label - The tooltip label text
 * @param {Function} props.onClick - Click handler function
 * @param {string} props.className - Additional CSS classes for styling
 * @param {boolean} props.disabled - Whether the button is disabled
 */
export default function HoverActionButton({ 
  icon, 
  label, 
  onClick, 
  className = "", 
  disabled = false 
}) {
  const handleClick = (e) => {
    if (disabled) return;
    
    // Stop propagation to prevent card clicks
    e.stopPropagation();
    
    // Remove focus to clear hover state
    try { 
      e.currentTarget.blur(); 
    } catch (err) {}
    
    // Call the onClick handler
    if (onClick) onClick(e);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={handleClick}
        whileHover={!disabled ? { scale: 1.15 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        transition={{ duration: 0.12, ease: "easeOut" }}
        disabled={disabled}
        className={`peer bg-white p-3 rounded-full shadow transition-all ${
          disabled 
            ? "opacity-50 cursor-not-allowed" 
            : "hover:shadow-md"
        } ${className}`}
        type="button"
      >
        {icon}
      </motion.button>

      {/* Tooltip */}
      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 peer-hover:opacity-100 transition-opacity text-xs bg-white text-gray-800 px-2 py-1 rounded shadow pointer-events-none whitespace-nowrap z-50">
        {label}
      </div>
    </div>
  );
}