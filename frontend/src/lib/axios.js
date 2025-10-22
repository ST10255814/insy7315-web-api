import axios from "axios"
import Toast from "./toast";
import { navigateTo } from "../utils/navigation";

// Avoid circular dependency by defining logout logic here
const clearUserSession = () => {
  // Clear all user-related localStorage items
  localStorage.removeItem("user");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userFullname");
  localStorage.removeItem("userId");
  
  // Clear any other session data
  try {
    // Import queryClient dynamically to avoid circular dependency
    import("./queryClient.js").then((module) => {
      module.default.clear();
    });
  } catch (error) {
    console.warn("Could not clear query cache:", error);
  }
};

const api = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {'Content-Type': 'application/json'},
    withCredentials: true
})

api.interceptors.response.use(
  (response) => {
    console.log('Axios response: ', response)
    return response;
  },
  async (error) => {
    console.log('Axios error: ', error)
    if (error.response?.status === 401) {
      const errorMessage = error.response.data?.error || error.response.data?.message || "Session expired. Please login again.";
      Toast.error(errorMessage);
      
      // Clear session immediately (don't wait for logout API call)
      clearUserSession();
      
      // Try to call logout endpoint (but don't block on it)
      try {
        await api.post("/api/user/logout", {}, { withCredentials: true });
      } catch (logoutError) {
        console.warn("Logout API call failed (this is expected during 401):", logoutError);
      }
      
      // Force redirect to login page
      if (window.location.pathname !== "/login") {
        // Use React Router navigation to preserve toast messages
        navigateTo("/login");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
