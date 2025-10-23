import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

//FIXME: Change from sending email with link to sending email with code for MFA reset
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-200/25 to-purple-200/15 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/30 to-cyan-100/20 rounded-full blur-3xl" style={{animationDelay: '2s'}}></div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="backdrop-blur-lg bg-white/85 rounded-3xl shadow-2xl border border-white/30 p-8 w-full max-w-sm text-center relative z-10"
      >
        {/* Subtle card background gradient */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100/20 to-transparent rounded-full blur-2xl"></div>
        <h1 className="text-2xl font-bold text-blue-700 mb-4 relative z-10">
          Password Reset Email Sent
        </h1>

        <p className="text-gray-700 mb-6 relative z-10">
          We've sent a secure password reset link to:{" "}
          <span className="font-semibold text-blue-700">
            {getMaskedEmail(email)}
          </span>
          . <br/><br/>Please check your inbox to reset your account password.
        </p>

        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="relative z-10">
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
