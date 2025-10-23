import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Toast from "../lib/toast.js";
import { useFormValidation, validators } from "../hooks/useFormValidation.js";
import { useAuth } from "../hooks/useAuth.js";
import AuthLayout from "./ui/AuthLayout.jsx";
import FormField from "./ui/FormField.jsx";
import FormInput from "./ui/FormInput.jsx";
import PasswordInput from "./ui/PasswordInput.jsx";
import LoadingButton from "./ui/LoadingButton.jsx";

export default function Register() {
  const { isLoading, isShaking, register } = useAuth();

  const validationRules = {
    username: {
      required: true,
      requiredMessage: "Username is required",
      validator: validators.username,
      validatorMessage: "Username must be 3-20 characters, letters, numbers, and underscores only",
    },
    fullName: {
      required: true,
      requiredMessage: "Full name is required",
    },
    email: {
      required: true,
      requiredMessage: "Email is required",
      validator: validators.email,
      validatorMessage: "Please enter a valid email address",
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
      username: "",
      fullName: "",
      email: "",
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

    const result = await register({
      username: formData.username,
      fullname: formData.fullName,
      email: formData.email,
      password: formData.password,
    });

    if (result.success) {
      resetForm();
    }
  };

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Join RentWise to manage your rental properties"
      isShaking={isShaking}
      containerClassName="w-full max-w-md mx-4"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
        {/* Name and Username Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Full Name */}
          <FormField
            label="Full Name"
            error={errors.fullName}
          >
            <FormInput
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name..."
              hasError={!!errors.fullName}
              disabled={isLoading}
              className="p-2.5"
            />
          </FormField>

          {/* Username */}
          <FormField
            label="Username"
            error={errors.username}
          >
            <FormInput
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username..."
              hasError={!!errors.username}
              disabled={isLoading}
              className="p-2.5"
            />
          </FormField>
        </div>

        {/* Email - Full Width */}
        <FormField
          label="Email"
          error={errors.email}
        >
          <FormInput
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email..."
            hasError={!!errors.email}
            disabled={isLoading}
            className="p-2.5"
          />
        </FormField>

        {/* Password - Full Width */}
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
            className="p-2.5"
          />
        </FormField>

        {/* Register Button */}
        <LoadingButton
          type="submit"
          isLoading={isLoading}
          loadingText="Registering"
          className="mt-2"
        >
          Register
        </LoadingButton>
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
    </AuthLayout>
  );
}
