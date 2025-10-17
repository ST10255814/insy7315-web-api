import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

export default function ForgotPassword() {
  const location = useLocation();
  const email = location.state?.email || "your@email.com"; // fallback if none passed

  // Mask email for display (e.g., j***@example.com)
  const getMaskedEmail = (email) => {
    const [local, domain] = email.split("@");
    if (local.length <= 2) return `*${local[local.length - 1]}@${domain}`;
    const masked =
      local[0] + "*".repeat(local.length - 2) + local[local.length - 1];
    return `${masked}@${domain}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EFF6FF] p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="backdrop-blur-md bg-white/80 rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center"
      >
        <h1 className="text-2xl font-bold text-blue-700 mb-4">
          Password Reset Email Sent
        </h1>

        <p className="text-gray-700 mb-6">
          We’ve sent a secure password reset link to:{" "}
          <span className="font-semibold text-blue-700">
            {getMaskedEmail(email)}
          </span>
          . <br/><br/>Please check your inbox to reset your account password.
        </p>

        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Link
            to="/login"
            className="inline-block bg-blue-700 text-white font-semibold py-3 px-5 rounded-xl shadow-md hover:bg-blue-800 transition"
          >
            Back to Login
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
