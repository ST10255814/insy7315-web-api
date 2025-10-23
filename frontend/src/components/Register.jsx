import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Toast from "../lib/toast.js";
import api from "../lib/axios.js";

export default function Register() {
  const [offsetY, setOffsetY] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Passwords are required";
    if (formData.password && formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (Object.keys(newErrors).length > 0) {
      setFormData((prev) => ({ ...prev, errors: newErrors }));
      setIsShaking(true);
      Toast.error("Please fix the errors in the form");
      setTimeout(() => setIsShaking(false), 600);
      return;
    }

    // Start loading animation
    setFormData((prev) => ({
      ...prev,
      errors: {},
      isLoading: true,
      registerText: "Registering",
    }));

    // Wait for button tap animation to finish
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      // Call registration API
      const response = await api.post("/api/user/register", {
        username: formData.username,
        fullname: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      // Only set localStorage if successful
      if (response.data && response.data.user) {
        localStorage.setItem(
          "userEmail",
          JSON.stringify(response.data.user.email)
        );
        localStorage.setItem(
          "userFullname",
          JSON.stringify(response.data.user.fullname)
        );
      }

      Toast.success(response.data.message);

      // Reset form immediately
      setFormData({
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

      // Navigate to login after a short delay
      setTimeout(() => navigate("/login"), 500);
    } catch (error) {
      // Don't show toast if error was already handled by 401 interceptor
      if (error.isHandledBy401Interceptor) {
        // Still reset form state for UI purposes
        setFormData((prev) => ({
          ...prev,
          isLoading: false,
          registerText: "Register",
        }));
        return;
      }
      
      const errorMsg = error.response?.data?.error || "Registration failed";
      console.log("Registration error:", errorMsg);

      setFormData((prev) => ({
        ...prev,
        isLoading: false,
        registerText: "Register",
      }));

      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);

      Toast.error(errorMsg);
    }
  };

  const shakeAnimation = {
    x: [0, -10, 10, -8, 8, -5, 5, 0],
    transition: { duration: 0.6, ease: "easeInOut" },
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 overflow-auto py-8">
      {/* Background decorative elements */}
      <div 
        className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-purple-200/20 rounded-full blur-3xl animate-float"
        style={{ transform: `translateY(${offsetY * 0.3}px)` }}
      ></div>
      <div 
        className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-100/40 to-cyan-100/30 rounded-full blur-3xl"
        style={{ transform: `translateY(-${offsetY * 0.2}px)` }}
      ></div>
      <div 
        className="absolute top-1/3 right-1/3 w-36 h-36 bg-gradient-to-br from-green-100/25 to-purple-100/15 rounded-full blur-2xl animate-float"
        style={{ animationDelay: '3s', transform: `translateY(${offsetY * 0.15}px)` }}
      ></div>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={
          isShaking
            ? { ...shakeAnimation, opacity: 1, y: 0, scale: 1 }
            : { opacity: 1, y: 0, scale: 1 }
        }
        transition={{ duration: 1 }}
        className="backdrop-blur-lg bg-white/85 rounded-3xl shadow-2xl border border-white/30 p-6 sm:p-8 w-full max-w-md mx-4 text-center relative z-10"
      >
        {/* Subtle card background gradient */}
        <div className="absolute top-0 left-0 w-28 h-28 bg-gradient-to-br from-blue-100/20 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-100/15 to-transparent rounded-full blur-xl"></div>
        <div className="mb-6 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-blue-700"
          >
            Create Your Account
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-gray-600 mt-2"
          >
            Join RentWise to manage your rental properties
          </motion.p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left relative z-10">
          {/* Name and Username Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Full Name */}
            <div>
              <label className="block text-blue-700 font-semibold mb-1 text-sm">
                Full Name
              </label>
              <motion.input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name..."
                className={`w-full p-2.5 border rounded-xl outline-none shadow-sm transition text-sm
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
                    className="text-[#FF3B30] text-xs mt-1 font-medium"
                  >
                    {formData.errors.fullName}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Username */}
            <div>
              <label className="block text-blue-700 font-semibold mb-1 text-sm">
                Username
              </label>
              <motion.input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username..."
                className={`w-full p-2.5 border rounded-xl outline-none shadow-sm transition text-sm
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
                    className="text-[#FF3B30] text-xs mt-1 font-medium"
                  >
                    {formData.errors.username}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Email - Full Width */}
          <div>
            <label className="block text-blue-700 font-semibold mb-1 text-sm">
              Email
            </label>
            <motion.input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email..."
              className={`w-full p-2.5 border rounded-xl outline-none shadow-sm transition text-sm
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
                  className="text-[#FF3B30] text-xs mt-1 font-medium"
                >
                  {formData.errors.email}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Password - Full Width */}
          <div className="flex flex-col gap-1 w-full">
            <label className="block text-blue-700 font-semibold mb-1 text-sm">
              Password
            </label>
            <div className="relative w-full">
              <motion.input
                type={formData.showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password..."
                className={`w-full p-2.5 pr-10 border rounded-xl outline-none shadow-sm transition text-sm
                    ${
                      formData.errors.password && !formData.password
                        ? "border-[#FF3B30] focus:ring-2 focus:ring-[#FF3B30]"
                        : "border-gray-300 focus:ring-2 focus:ring-blue-700"
                    }`}
                disabled={formData.isLoading}
                style={{ minHeight: "42px" }}
              />
              {formData.password.length > 0 && (
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-500 hover:text-gray-700"
                >
                  {formData.showPassword ? (
                    <FaEyeSlash size={18} />
                  ) : (
                    <FaEye size={18} />
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
                  className="text-[#FF3B30] text-xs mt-1 font-medium"
                >
                  {formData.errors.password}
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
            className={`mt-2 font-semibold py-2.5 rounded-xl shadow-md transition-colors duration-150 text-white ${
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
          className="mt-4 text-blue-700 text-center"
        >
          <p className="text-sm">
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
