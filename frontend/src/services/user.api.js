import api from "../lib/axios.js";
import queryClient from "../lib/queryClient.js";

// Centralized function to clear all user session data
export function clearUserSession() {
  // Clear all user-related sessionStorage items
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("userId");
  
  // Clear React Query cache
  queryClient.clear();
}

export async function logoutUser() {
  try {
    // Always clear session first (in case API call fails)
    clearUserSession();
    
    // Then try to notify the server
    const response = await api.post(
      "/api/user/logout",
      {},
      { withCredentials: true }
    );
    
    return response.data;
  } catch (error) {
    // Even if server logout fails, session is already cleared
    console.warn("Server logout failed, but local session cleared:", error);
    throw error;
  }
}
