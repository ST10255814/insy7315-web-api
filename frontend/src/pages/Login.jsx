import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Toast from "../lib/toast.js";
import { useFormValidation } from "../hooks/useFormValidation.js";
import { useAuth } from "../hooks/useAuth.js";
import AuthLayout from "../components/common/AuthLayout.jsx";
import FormField from "../components/common/FormField.jsx";
import FormInput from "../components/common/FormInput.jsx";
import PasswordInput from "../components/common/PasswordInput.jsx";
import LoadingButton from "../components/common/LoadingButton.jsx";

export default function Login() {
  const { isLoading, isShaking, login, handleForgotPasswordFromStorage } = useAuth();
  
  const validationRules = {
    prefLogin: {
      required: true,
      requiredMessage: "Email or username is required",
    },
    password: {
      required: true,
      requiredMessage: "Password is required",
      minLength: 6,
      minLengthMessage: "Password must be at least 6 characters",
    },
  };

  const {
    formData,
    errors,
    handleChange,
    validateForm,
    resetForm,
  } = useFormValidation(
    {
      prefLogin: "",
      password: "",
    },
    validationRules
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Toast.error("Please fix the errors in the form");
      return;
    }

    const result = await login({
      prefLogin: formData.prefLogin,
      password: formData.password,
    });

    if (result.success) {
      resetForm();
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    await handleForgotPasswordFromStorage();
  };

  return (
    <AuthLayout
      title="Welcome Back!"
      subtitle="Sign in to access your RentWise dashboard"
      isShaking={isShaking}
      containerClassName="w-[90%] sm:w-[380px]"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-left">
        {/* Email/Username Field */}
        <FormField
          label="Email or Username"
          error={errors.prefLogin}
        >
          <FormInput
            name="prefLogin"
            value={formData.prefLogin}
            onChange={handleChange}
            placeholder="Enter your email or username..."
            hasError={!!errors.prefLogin}
            disabled={isLoading}
          />
        </FormField>

        {/* Password Field */}
        <FormField
          label="Password"
          error={errors.password}
        >
          <PasswordInput
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password..."
            hasError={!!errors.password}
            disabled={isLoading}
          />
        </FormField>

        {/* Login Button */}
        <LoadingButton
          type="submit"
          isLoading={isLoading}
          loadingText="Logging in"
          className="mt-3"
        >
          Login
        </LoadingButton>
      </form>

      {/* Forgot Password */}
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.1 }}
        className="text-center mt-3"
      >
        <button
          onClick={handleForgotPassword}
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
    </AuthLayout>
  );
}
