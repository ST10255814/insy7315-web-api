import { motion } from "framer-motion";

export default function StatsCard({ title, value, subtitle, color, icon }) {
  // Map Tailwind color names to actual hex colors for the border
  const colorMap = {
    blue: "#3B82F6",
    green: "#22C55E",
    purple: "#A855F7",
    orange: "#F97316",
  };

  return (
    <motion.div
      className="bg-white/85 backdrop-blur-sm p-6 rounded-3xl shadow-lg cursor-pointer hover:shadow-xl transition-all border-l-8 border border-white/20 relative overflow-hidden"
      style={{ borderLeftColor: colorMap[color] || colorMap.blue }}
      whileHover={{ 
        scale: 1.05, 
        boxShadow: "0 25px 50px rgba(0,0,0,0.12)",
        backgroundColor: "rgba(255,255,255,0.95)"
      }}
    >
      {/* Subtle background gradient */}
      <div 
        className="absolute top-0 right-0 w-24 h-24 opacity-10 rounded-full blur-2xl"
        style={{ 
          backgroundColor: colorMap[color] || colorMap.blue,
        }}
      ></div>
      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-gray-600 text-lg font-medium">{title}</p>
          <motion.p
            className={`text-3xl font-bold mt-2`}
            style={{ color: colorMap[color] || colorMap.blue }}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {value}
          </motion.p>
          <p
            className="text-sm font-medium mt-2"
            style={{ color: colorMap[color] ? `${colorMap[color]}99` : "#3B82F699" }} // lighter opacity
          >
            {subtitle}
          </p>
        </div>
        <motion.div
          className="p-4 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20"
          style={{ backgroundColor: colorMap[color] + "20" }} // light background
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          whileHover={{ scale: 1.1 }}
        >
          <span style={{ color: colorMap[color], fontSize: "1.5rem" }}>{icon}</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
