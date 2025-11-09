import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function PasswordReset() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
    showPassword: false,
    showConfirmPassword: false,
    errors: {},
    isLoading: false,
    submitText: "Reset Password",
    success: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      errors: {
        ...prev.errors,
        [name]: value ? undefined : prev.errors[name],
      },
    }));
  };

  const togglePassword = () =>
    setFormData((prev) => ({ ...prev, showPassword: !prev.showPassword }));

  const toggleConfirmPassword = () =>
    setFormData((prev) => ({
      ...prev,
      showConfirmPassword: !prev.showConfirmPassword,
    }));

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = {};
    if (!formData.password) errors.password = "Password is required";
    if (formData.password && formData.password.length < 6)
      errors.password = "Password must be at least 6 characters";
    if (!formData.confirmPassword) errors.confirmPassword = "Please confirm password";
    if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = "Passwords do not match";

    if (Object.keys(errors).length > 0) {
      setFormData((prev) => ({ ...prev, errors }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      isLoading: true,
      submitText: "Resetting",
      errors: {},
    }));

    setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        isLoading: false,
        success: true,
        password: "",
        confirmPassword: "",
        submitText: "Reset Password",
      }));
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-200/25 to-purple-200/15 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-br from-blue-100/30 to-cyan-100/20 rounded-full blur-3xl" style={{animationDelay: '1.5s'}}></div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="backdrop-blur-lg bg-white/85 rounded-3xl shadow-2xl border border-white/30 p-8 w-full max-w-sm text-center relative z-10"
      >
        {/* Subtle card background gradient */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-100/20 to-transparent rounded-full blur-2xl"></div>
        <h1 className="text-2xl font-bold text-blue-700 mb-2 relative z-10">
          {formData.success ? "Password Reset Successful!" : "Reset Your Password"}
        </h1>
        <p className="text-gray-600 mb-6 relative z-10">
          {formData.success
            ? "Your password has been updated. You can now log in with your new password."
            : "Enter your new password below and confirm it to reset your account password."}
        </p>

        {!formData.success && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left relative z-10">
            {/* Password */}
            <div className="flex flex-col gap-1 w-full">
              <label className="block text-blue-700 font-semibold mb-1">New Password</label>
              <div className="relative w-full">
                <input
                  type={formData.showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter new password..."
                  className={`w-full p-3 pr-10 border rounded-xl outline-none shadow-sm transition
                    ${
                      formData.errors.password
                        ? "border-[#FF3B30] focus:ring-2 focus:ring-[#FF3B30]"
                        : "border-gray-300 focus:ring-2 focus:ring-blue-700"
                    }`}
                />
                {formData.password.length > 0 && (
                  <button
                    type="button"
                    onClick={togglePassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {formData.showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                )}
              </div>
              <AnimatePresence>
                {formData.errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-[#FF3B30] text-sm mt-1 font-medium"
                  >
                    {formData.errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1 w-full">
              <label className="block text-blue-700 font-semibold mb-1">Confirm Password</label>
              <div className="relative w-full">
                <input
                  type={formData.showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password..."
                  className={`w-full p-3 pr-10 border rounded-xl outline-none shadow-sm transition
                    ${
                      formData.errors.confirmPassword
                        ? "border-[#FF3B30] focus:ring-2 focus:ring-[#FF3B30]"
                        : "border-gray-300 focus:ring-2 focus:ring-blue-700"
                    }`}
                />
                {formData.confirmPassword.length > 0 && (
                  <button
                    type="button"
                    onClick={toggleConfirmPassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {formData.showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                )}
              </div>
              <AnimatePresence>
                {formData.errors.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-[#FF3B30] text-sm mt-1 font-medium"
                  >
                    {formData.errors.confirmPassword}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={formData.isLoading}
              whileHover={!formData.isLoading ? { scale: 1.03, backgroundColor: "#1E40AF" } : {}}
              whileTap={!formData.isLoading ? { scale: 0.97 } : {}}
              className={`mt-4 font-semibold py-3 rounded-xl shadow-md text-white transition-colors duration-150 ${
                formData.isLoading ? "bg-blue-800/70 cursor-not-allowed" : "bg-blue-700"
              }`}
            >
              {formData.isLoading ? (
                <span className="inline-flex ml-1">
                  Resetting
                  {[".", ".", "."].map((dot, index) => (
                    <motion.span
                      key={index}
                      className="mx-[2px]"
                      animate={{ y: [0, -6, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: index * 0.15,
                      }}
                    >
                      {dot}
                    </motion.span>
                  ))}
                </span>
              ) : (
                formData.submitText
              )}
            </motion.button>
          </form>
        )}

        {/* Success Message */}
        {formData.success && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4 bg-blue-50 border border-blue-200 rounded-lg p-6"
          >
            <p className="text-blue-900 font-semibold text-lg">Password Reset Successful!</p>
            <p className="text-blue-800">
              Your password has been successfully reset. You can now log in with your new password.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
