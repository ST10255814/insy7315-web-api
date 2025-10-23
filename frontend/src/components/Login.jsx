import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Toast from "../lib/toast.js";
import api from "../lib/axios.js";

export default function Login() {
  const navigate = useNavigate();
  const [offsetY, setOffsetY] = useState(0);
  const [isShaking, setIsShaking] = useState(false);

  const [formData, setFormData] = useState({
    prefLogin: "",
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

  const handleEmailSending = async (e) => {
    e.preventDefault();
    const userEmail = JSON.parse(localStorage.getItem("userEmail"));
    const userFullname = JSON.parse(localStorage.getItem("userFullname"));

    if (userEmail && userFullname) {
      try {
          await api.post("/api/user/forgot-password", {
          email: userEmail.toLowerCase(),
          name: userFullname,
        });
        navigate("/forgot-password", { state: { email: userEmail } });
      } catch (error) {
        const errorMsg = error.response?.data?.error || "Request failed";
        console.log("Request error:", errorMsg);
        Toast.error(errorMsg);
      }
    }
    else{
      Toast.error("No account registered with us. Please register first.");
    }
  };

  const togglePassword = () => {
    setFormData((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.prefLogin)
      newErrors.prefLogin = "Email or username is required";
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

    try {
      const response = await api.post("/api/user/login", {
        prefLogin: formData.prefLogin,
        password: formData.password,
      });
      const userData = response.data.data.user;
      localStorage.setItem(
        "user",
        JSON.stringify(userData.fullname)
      );
      Toast.success(response.data.message);

      // Reset form and loading state
      setFormData({
        prefLogin: "",
        password: "",
        isLoading: false,
        loginText: "Login",
        showPassword: false,
        errors: {},
      });
      // Navigate to dashboard
      setTimeout(() => navigate(`/dashboard/${userData._id}`), 500);
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Login failed";
      console.log("Login error:", errorMsg);

      setFormData((prev) => ({
        ...prev,
        isLoading: false,
        loginText: "Login",
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
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 overflow-hidden">
      {/* Background decorative elements */}
      <div 
        className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-200/20 rounded-full blur-3xl animate-float"
        style={{ transform: `translateY(${offsetY * 0.3}px)` }}
      ></div>
      <div 
        className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-100/40 to-cyan-100/30 rounded-full blur-3xl"
        style={{ transform: `translateY(-${offsetY * 0.2}px)` }}
      ></div>
      <div 
        className="absolute top-1/2 left-1/3 w-40 h-40 bg-gradient-to-br from-purple-100/25 to-pink-100/15 rounded-full blur-2xl animate-float"
        style={{ animationDelay: '2s', transform: `translateY(${offsetY * 0.1}px)` }}
      ></div>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={
          isShaking
            ? { ...shakeAnimation, opacity: 1, y: 0, scale: 1 }
            : { opacity: 1, y: 0, scale: 1 }
        }
        transition={{ duration: 1 }}
        className="backdrop-blur-lg bg-white/85 rounded-3xl shadow-2xl border border-white/30 p-4 sm:p-6 w-[90%] sm:w-[380px] text-center relative z-10"
      >
        {/* Subtle card background gradient */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100/20 to-transparent rounded-full blur-2xl"></div>
        <div className="mb-4 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl sm:text-3xl font-bold text-blue-700"
          >
            Welcome Back!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xs sm:text-sm text-gray-600 mt-1"
          >
            Sign in to access your RentWise dashboard
          </motion.p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-left relative z-10">
          {/* Email */}
          <div>
            <label className="block text-blue-700 font-semibold mb-1 text-sm">
              Email or Username
            </label>
            <motion.input
              type="text"
              name="prefLogin"
              value={formData.prefLogin}
              onChange={handleChange}
              placeholder="Enter your email or username..."
              className={`w-full px-3 py-2.5 border rounded-xl outline-none shadow-sm transition text-sm
                ${
                  formData.errors.prefLogin && !formData.prefLogin
                    ? "border-[#FF3B30] focus:ring-2 focus:ring-[#FF3B30]"
                    : "border-gray-300 focus:ring-2 focus:ring-blue-700"
                }`}
              disabled={formData.isLoading}
            />
            <AnimatePresence>
              {formData.errors.prefLogin && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-[#FF3B30] text-sm mt-1 font-medium"
                >
                  {formData.errors.prefLogin}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

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
                className={`w-full px-3 py-2.5 pr-10 border rounded-xl outline-none shadow-sm transition text-sm
                    ${
                      formData.errors.password && !formData.password
                        ? "border-[#FF3B30] focus:ring-2 focus:ring-[#FF3B30]"
                        : "border-gray-300 focus:ring-2 focus:ring-blue-700"
                    }`}
                disabled={formData.isLoading}
                style={{ minHeight: "42px" }}
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
            className={`mt-3 font-semibold py-2.5 rounded-xl shadow-md transition-colors duration-150 text-white text-sm ${
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
          className="text-center mt-3"
        >
          <button
            onClick={handleEmailSending}
            className="text-xs sm:text-sm text-blue-700 hover:text-blue-800 hover:underline transition-all duration-100 bg-transparent border-none cursor-pointer"
          >
            Forgot Password?
          </button>
        </motion.div>

        {/* Register CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 text-blue-700"
        >
          <p className="text-xs sm:text-sm">
            Don't have an account?{" "}
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
