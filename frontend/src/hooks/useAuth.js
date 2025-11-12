import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../lib/toast.js";
import api from "../lib/axios.js";

/**
 * Custom hook for authentication operations (login, register, forgot password)
 * @returns {Object} Authentication utilities and state
 */
export function useAuth() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const triggerShake = useCallback(() => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 600);
  }, []);

  /**
   * Handle user login
   * @param {Object} credentials - Login credentials
   * @param {String} credentials.prefLogin - Email or username
   * @param {String} credentials.password - Password
   */
  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    
    try {
      const response = await api.post("/api/user/login", {
        prefLogin: credentials.prefLogin,
        password: credentials.password,
      });
      
      const userData = response.data.data.user;
      sessionStorage.setItem("user", JSON.stringify(userData.fullname));
      sessionStorage.setItem("userId", JSON.stringify(userData._id));
      Toast.success(response.data.message);
      
      // Navigate to dashboard after a short delay
      setTimeout(() => navigate(`/dashboard/${userData._id}`), 500);
      
      return { success: true, user: userData };
    } catch (error) {
      // Don't show toast if error was already handled by 401 interceptor
      if (error.isHandledBy401Interceptor) {
        return { success: false, error: "Authentication failed" };
      }
      
      const errorMsg = error.response?.data?.error || "Login failed";
      console.log("Login error:", errorMsg);
      Toast.error(errorMsg);
      triggerShake();
      
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, [navigate, triggerShake]);

  /**
   * Handle user registration
   * @param {Object} userData - Registration data
   * @param {String} userData.username - Username
   * @param {String} userData.fullname - Full name
   * @param {String} userData.email - Email address
   * @param {String} userData.password - Password
   */
  const register = useCallback(async (userData) => {
    setIsLoading(true);
    
    // Add a slight delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    try {
      const response = await api.post("/api/user/register", {
        username: userData.username,
        fullname: userData.fullname,
        email: userData.email,
        password: userData.password,
      });

      // Store user data in sessionStorage if successful
      if (response.data && response.data.user) {
        sessionStorage.setItem(
          "userEmail",
          JSON.stringify(response.data.user.email)
        );
        sessionStorage.setItem(
          "userFullname",
          JSON.stringify(response.data.user.fullname)
        );
      }

      Toast.success(response.data.message);
      
      // Navigate to login after a short delay
      setTimeout(() => navigate("/login"), 500);
      
      return { success: true, user: response.data.user };
    } catch (error) {
      // Don't show toast if error was already handled by 401 interceptor
      if (error.isHandledBy401Interceptor) {
        return { success: false, error: "Registration failed" };
      }
      
      const errorMsg = error.response?.data?.error || "Registration failed";
      console.log("Registration error:", errorMsg);
      Toast.error(errorMsg);
      triggerShake();
      
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, [navigate, triggerShake]);

  /**
   * Handle forgot password
   * @param {Object} params - { email: string }
   */
  const forgotPassword = useCallback(async (params) => {
    try {
      await api.post("/api/user/forgot-password", {
        email: params.email,
      });
      return { success: true };
    } catch (error) {
      // Don't show toast if error was already handled by 401 interceptor
      if (error.isHandledBy401Interceptor) {
        return { success: false, error: "Request failed" };
      }
      
      const errorMsg = error.response?.data?.error || "Request failed";
      console.log("Request error:", errorMsg);
      Toast.error(errorMsg);
      
      return { success: false, error: errorMsg };
    }
  }, []);

  return {
    isLoading,
    isShaking,
    login,
    register,
    forgotPassword,
  };
}