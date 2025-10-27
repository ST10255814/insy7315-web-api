import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { lazy, useEffect, Suspense } from "react";
import { setNavigate } from "../utils/navigation";
import Navbar from "../components/layout/Navbar";
import { DelayedSuspense } from "../components/common/index.js";

// Lazy load pages for better performance
const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const PasswordReset = lazy(() => import("../pages/PasswordReset"));
const Dashboard = lazy(() => import("../components/layout/Dashboard"));
const NotFound = lazy(() => import("../pages/NotFound"));

/**
 * Centralized routing configuration for the application
 * Handles route definitions and conditional navbar rendering
 */
export default function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Set up the navigation function for use in axios interceptors
    setNavigate(navigate);
  }, [navigate]);

  // Define routes where navbar should be shown
  const definedRoutes = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];
  const isDashboardRoute = location.pathname.startsWith("/dashboard/");
  const isDefinedRoute =
    definedRoutes.includes(location.pathname) || isDashboardRoute;
  const showNavbar = isDefinedRoute;

  return (
    <>
      <Suspense fallback={<EnhancedBrandedFallback />}>
        {showNavbar && <Navbar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<PasswordReset />} />
          <Route path="/dashboard/:userId/*" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}
