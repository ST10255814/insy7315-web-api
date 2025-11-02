import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { FaHome, FaExclamationTriangle, FaArrowLeft } from "react-icons/fa";

export default function DashboardNotFound() {
  const navigate = useNavigate();
  const { userId: adminId } = useParams();

  const handleGoBack = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  const handleGoToDashboard = () => {
    navigate(`/dashboard/${adminId}/overview`);
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center text-center max-w-md mx-auto"
      >
        {/* Error Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mb-6"
        >
          <FaExclamationTriangle className="text-yellow-500 text-6xl" />
        </motion.div>

      {/* Error Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          The dashboard page you're looking for doesn't exist.
        </p>
        <p className="text-sm text-gray-500">
          The URL might be incorrect or the page may have been moved.
        </p>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <motion.button
          onClick={handleGoBack}
          whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(107,114,128,0.3)" }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300 shadow-md"
        >
          <FaArrowLeft className="text-sm" />
          Go Back
        </motion.button>

        <motion.button
          onClick={handleGoToDashboard}
          whileHover={{ 
            scale: 1.05, 
            boxShadow: "0 8px 25px rgba(59,130,246,0.4)" 
          }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md"
        >
          <FaHome className="text-sm" />
          Dashboard Home
        </motion.button>
      </motion.div>
      </motion.div>
    </div>
  );
}