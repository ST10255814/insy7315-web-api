import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  AuthLayout,
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
  const { isLoading, forgotPassword } = useAuth();

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
    const masked = local[0] + "*".repeat(local.length - 2) + local[local.length - 1];
    return `${masked}@${domain}`;
  };

  if (!submitted) {
    return (
      <AuthLayout
        title="Forgot Password"
        subtitle="Enter your email to receive a password reset link."
        containerClassName="w-[90%] sm:w-[380px]"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-left">
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
          <LoadingButton
            type="submit"
            isLoading={isLoading}
            loadingText="Sending reset link"
            className="w-full"
            disabled={isLoading}
          >
            Send Reset Link
          </LoadingButton>
        </form>
      </AuthLayout>
    );
  }

  // Success message (outside AuthLayout)
  return (
    <div className="flex flex-col items-center mb-6 relative z-10 p-8 w-full max-w-sm mx-auto">
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
  );
}
