import api from "../lib/axios.js";

/**
 * Debug API functions to help troubleshoot authentication issues
 */

export async function testAuthDebug() {
  try {
    const response = await api.get("/api/user/auth-debug", { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Auth debug test failed:", error);
    throw error;
  }
}

export async function testCSRFToken() {
  try {
    const response = await api.get("/api/security/csrf-token", { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("CSRF token test failed:", error);
    throw error;
  }
}

export async function testBasicConnection() {
  try {
    const response = await api.get("/", { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Basic connection test failed:", error);
    throw error;
  }
}