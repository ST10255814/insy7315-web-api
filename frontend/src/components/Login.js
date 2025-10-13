import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Toast from "../lib/toast";

export default function Login() {
  const [offsetY, setOffsetY] = useState(0);
  const [isShaking, setIsShaking] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    showPassword: false,
    errors: {},
    isLoading: false,
    loginText: "Login",
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
        [name]: value ? undefined : prev.errors[name], // Remove error if user types something
      },
    }));
  };

  const togglePassword = () => {
    setFormData((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password && formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (Object.keys(newErrors).length > 0) {
      setFormData((prev) => ({ ...prev, errors: newErrors }));
      setIsShaking(true);
      Toast.error("Please fix the errors in the form");
      setTimeout(() => setIsShaking(false), 600);
      return;
    }

    // Set button to loading
    setFormData((prev) => ({
      ...prev,
      errors: {},
      isLoading: true,
      loginText: "Logging in",
    }));

    // Simulate API call
    new Promise((resolve) => setTimeout(resolve, 2000)).then(() => {
      // Reset form and button text immediately
      setFormData((prev) => ({
        ...prev,
        loginText: "Login", // Button text immediately back to Login
        isLoading: false,
        email: "",
        password: "",
        showPassword: false,
        errors: {},
      }));

      // Toast shows the success message
      Toast.success("Login successful!");
    });
  };

  const shakeAnimation = {
    x: [0, -10, 10, -8, 8, -5, 5, 0],
    transition: { duration: 0.6, ease: "easeInOut" },
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-[#EFF6FF] overflow-hidden"
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
        className="backdrop-blur-md bg-white/70 rounded-2xl shadow-2xl p-8 w-[90%] sm:w-[400px] text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-blue-700 mb-6"
        >
          Welcome Back!
        </motion.h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
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

              {/* Eye Icon */}
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

          {/* Login Button */}
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
            {formData.loginText}
            {formData.isLoading && formData.loginText === "Logging in" && (
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

        {/* Forgot Password */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.1 }}
          className="text-center mt-4"
        >
          <Link
            to={formData.email ? "/forgot-password" : "#"} // navigate only if email is filled
            state={{ email: formData.email }} 
            onClick={(e) => {
              if (!formData.email) {
                e.preventDefault(); // prevent navigation
                setFormData((prev) => ({
                  ...prev,
                  errors: {
                    ...prev.errors,
                    email: "Please enter your email before resetting password",
                  },
                }));
              }
            }}
            className="text-sm text-blue-700 hover:text-blue-800 hover:underline transition-all duration-100"
          >
            Forgot Password?
          </Link>
        </motion.div>

        {/* Register CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-blue-700"
        >
          <p>
            Don’t have an account?{" "}
            <motion.span
              whileHover={{ scale: 1.05, color: "#1E40AF" }}
              transition={{ duration: 0.1 }}
            >
              <Link
                to="/register"
                className="font-semibold text-blue-700 hover:text-blue-800 hover:underline transition-all duration-100"
              >
                Register here
              </Link>
            </motion.span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
