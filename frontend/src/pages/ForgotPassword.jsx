import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  FormField,
  FormInput,
  LoadingButton,
} from "../components/common/index.js";
import { useAuth } from "../hooks/useAuth.js";
import { useFormValidation } from "../hooks/useFormValidation.js";
import Toast from "../lib/toast.js";
import { HiOutlineMail } from "react-icons/hi";

export default function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);
  const { isLoading ,forgotPassword } = useAuth();

  const validationRules = {
    email: {
      required: true,
      requiredMessage: "Email is required",
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      patternMessage: "Please enter a valid email address",
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
      email: "",
    },
    validationRules
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Toast.error("Please fix the errors in the form");
      return;
    }

    const result = await forgotPassword({ email: formData.email });

    if (result.success) {
      resetForm();
      setSubmitted(true);
    }
  };

  // Mask email for display (e.g., j***@example.com)
  const getMaskedEmail = (email) => {
    const [local, domain] = email.split("@");
    if (!local || !domain) return email;
    if (local.length <= 2) return `*${local[local.length - 1]}@${domain}`;
    const masked =
      local[0] + "*".repeat(local.length - 2) + local[local.length - 1];
    return `${masked}@${domain}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-200/25 to-purple-200/15 rounded-full blur-3xl animate-float"></div>
      <div
        className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/30 to-cyan-100/20 rounded-full blur-3xl"
        style={{ animationDelay: "2s" }}
      ></div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="backdrop-blur-lg bg-white/90 rounded-3xl shadow-2xl border border-white/30 p-8 w-full max-w-sm text-center relative z-10"
      >
        {/* Subtle card background gradient */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100/20 to-transparent rounded-full blur-2xl"></div>
        {!submitted ? (
          <>
            <div className="flex flex-col items-center mb-4">
              <span className="bg-blue-100 text-blue-700 rounded-full p-3 mb-2 shadow">
                <HiOutlineMail size={32} />
              </span>
              <h1 className="text-2xl font-bold text-blue-700 mb-1">Forgot Password</h1>
              <span className="text-sm text-gray-500">Enter your email to receive a password reset link.</span>
            </div>
            <form onSubmit={handleSubmit} className="mb-6 relative z-10">
              <FormField label="Email Address" error={errors.email}>
                <FormInput
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. user@example.com"
                  hasError={!!errors.email}
                  disabled={isLoading}
                  autoFocus
                  className="text-base"
                />
              </FormField>
              <div className="flex flex-col items-center">
                <LoadingButton
                  type="submit"
                  isLoading={isLoading}
                  loadingText="Sending reset link"
                  className="mt-5 w-full"
                  disabled={isLoading}
                >
                  Send Reset Link
                </LoadingButton>
              </div>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center mb-6 relative z-10">
            <span className="bg-green-100 text-green-700 rounded-full p-3 mb-2 shadow">
              <HiOutlineMail size={32} />
            </span>
            <div className="text-gray-700 mb-2">
              We've sent a secure password reset link to:
              <span className="font-semibold text-blue-700 ml-1">
                {getMaskedEmail(formData.email)}
              </span>
            </div>
            <div className="text-gray-500 text-sm mb-2">
              Please check your inbox and follow the instructions to reset your account password.
            </div>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full mt-8"
            >
              <Link
                to="/login"
                className="inline-block bg-blue-700 text-white font-semibold py-3 px-5 rounded-xl shadow-md hover:bg-blue-800 transition w-full"
              >
                Back to Login
              </Link>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
