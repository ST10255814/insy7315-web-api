import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Toast from "../lib/toast.js";

export default function Register() {
  const [offsetY, setOffsetY] = useState(0);
  const [isShaking, setIsShaking] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
    showConfirmPassword: false,
    errors: {},
    isLoading: false,
    registerText: "Register",
  });

  useEffect(() => {
    const handleScroll = () => setOffsetY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      errors: {
        ...prev.errors,
        [name]: value ? undefined : prev.errors[name], // Remove error if user types
      },
    }));
  };

  const togglePassword = () => {
    setFormData((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  };

  const toggleConfirmPassword = () => {
    setFormData((prev) => ({
      ...prev,
      showConfirmPassword: !prev.showConfirmPassword,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Passwords are required";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Passwords are required";
    if (formData.password && formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setFormData((prev) => ({ ...prev, errors: newErrors }));
      setIsShaking(true);
      Toast.error("Please fix the errors in the form");
      setTimeout(() => setIsShaking(false), 600);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      errors: {},
      isLoading: true,
      registerText: "Registering",
    }));

    // Simulate API call
    new Promise((resolve) => setTimeout(resolve, 2000)).then(() => {
      setFormData((prev) => ({
        ...prev,
        registerText: "Register",
        isLoading: false,
        username: "",
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        showPassword: false,
        showConfirmPassword: false,
        errors: {},
      }));
      Toast.success("Registration successful!");
    });
  };

  const shakeAnimation = {
    x: [0, -10, 10, -8, 8, -5, 5, 0],
    transition: { duration: 0.6, ease: "easeInOut" },
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-[#EFF6FF] overflow-auto"
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url('https://images.unsplash.com/photo-1601597114581-42f0b6e1a7f8?auto=format&fit=crop&w=1950&q=80')`,
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPositionY: offsetY * 0.5,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={
          isShaking
            ? { ...shakeAnimation, opacity: 1, y: 0, scale: 1 }
            : { opacity: 1, y: 0, scale: 1 }
        }
        transition={{ duration: 1 }}
        className="backdrop-blur-md bg-white/70 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md mx-4 text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-blue-700 mb-6"
        >
          Create Your Account
        </motion.h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
          {/* Full Name */}
          <div>
            <label className="block text-blue-700 font-semibold mb-1">
              Full Name
            </label>
            <motion.input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name..."
              className={`w-full p-3 border rounded-xl outline-none shadow-sm transition
                ${
                  formData.errors.fullName && !formData.fullName
                    ? "border-[#FF3B30] focus:ring-2 focus:ring-[#FF3B30]"
                    : "border-gray-300 focus:ring-2 focus:ring-blue-700"
                }`}
              disabled={formData.isLoading}
            />
            <AnimatePresence>
              {formData.errors.fullName && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-[#FF3B30] text-sm mt-1 font-medium"
                >
                  {formData.errors.fullName}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Username */}
          <div>
            <label className="block text-blue-700 font-semibold mb-1">
              Username
            </label>
            <motion.input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username..."
              className={`w-full p-3 border rounded-xl outline-none shadow-sm transition
                ${
                  formData.errors.username && !formData.username
                    ? "border-[#FF3B30] focus:ring-2 focus:ring-[#FF3B30]"
                    : "border-gray-300 focus:ring-2 focus:ring-blue-700"
                }`}
              disabled={formData.isLoading}
            />
            <AnimatePresence>
              {formData.errors.username && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-[#FF3B30] text-sm mt-1 font-medium"
                >
                  {formData.errors.username}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Email */}
          <div>
            <label className="block text-blue-700 font-semibold mb-1">
              Email
            </label>
            <motion.input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email..."
              className={`w-full p-3 border rounded-xl outline-none shadow-sm transition
                ${
                  formData.errors.email && !formData.email
                    ? "border-[#FF3B30] focus:ring-2 focus:ring-[#FF3B30]"
                    : "border-gray-300 focus:ring-2 focus:ring-blue-700"
                }`}
              disabled={formData.isLoading}
            />
            <AnimatePresence>
              {formData.errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-[#FF3B30] text-sm mt-1 font-medium"
                >
                  {formData.errors.email}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1 w-full">
            <label className="block text-blue-700 font-semibold mb-1">
              Password
            </label>
            <div className="relative w-full">
              <motion.input
                type={formData.showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password..."
                className={`w-full p-3 pr-10 border rounded-xl outline-none shadow-sm transition
                    ${
                      formData.errors.password && !formData.password
                        ? "border-[#FF3B30] focus:ring-2 focus:ring-[#FF3B30]"
                        : "border-gray-300 focus:ring-2 focus:ring-blue-700"
                    }`}
                disabled={formData.isLoading}
                style={{ minHeight: "48px" }}
              />
              {formData.password.length > 0 && (
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-500 hover:text-gray-700"
                >
                  {formData.showPassword ? (
                    <FaEyeSlash size={20} />
                  ) : (
                    <FaEye size={20} />
                  )}
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
            <label className="block text-blue-700 font-semibold mb-1">
              Confirm Password
            </label>
            <div className="relative w-full">
              <motion.input
                type={formData.showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password..."
                className={`w-full p-3 pr-10 border rounded-xl outline-none shadow-sm transition
                    ${
                      formData.errors.confirmPassword
                        ? "border-[#FF3B30] focus:ring-2 focus:ring-[#FF3B30]"
                        : "border-gray-300 focus:ring-2 focus:ring-blue-700"
                    }`}
                disabled={formData.isLoading}
                style={{ minHeight: "48px" }}
              />
              {formData.confirmPassword.length > 0 && (
                <button
                  type="button"
                  onClick={toggleConfirmPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-500 hover:text-gray-700"
                >
                  {formData.showConfirmPassword ? (
                    <FaEyeSlash size={20} />
                  ) : (
                    <FaEye size={20} />
                  )}
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

          {/* Register Button */}
          <motion.button
            whileHover={
              !formData.isLoading
                ? { scale: 1.03, backgroundColor: "#1E40AF" }
                : {}
            }
            whileTap={!formData.isLoading ? { scale: 0.97 } : {}}
            transition={{ duration: 0.1, ease: "easeInOut" }}
            type="submit"
            disabled={formData.isLoading}
            className={`mt-4 font-semibold py-3 rounded-xl shadow-md transition-colors duration-150 text-white ${
              formData.isLoading
                ? "bg-blue-800/70 cursor-not-allowed"
                : "bg-blue-700"
            }`}
          >
            {formData.registerText}
            {formData.isLoading && formData.registerText === "Registering" && (
              <span className="inline-flex ml-1">
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
            )}
          </motion.button>
        </form>

        {/* Login CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-blue-700 text-center"
        >
          <p>
            Already have an account?{" "}
            <motion.span
              whileHover={{ scale: 1.05, color: "#1E40AF" }}
              transition={{ duration: 0.1 }}
            >
              <Link
                to="/login"
                className="font-semibold text-blue-700 hover:text-blue-800 hover:underline transition-all duration-100"
              >
                Login here
              </Link>
            </motion.span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
  