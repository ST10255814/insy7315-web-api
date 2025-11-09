import axios from "axios"
import Toast from "./toast";
import { navigateTo } from "../utils/navigation";

// Flag to track if we're already handling a 401 error
let isHandling401 = false;

// CSRF token management
let csrfToken = null;
let fetchingToken = false;

// Function to fetch CSRF token from server
const fetchCSRFToken = async () => {
  if (fetchingToken) {
    // Wait for ongoing fetch
    while (fetchingToken) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    return csrfToken;
  }
  
  try {
    fetchingToken = true;
    const response = await axios.get('/api/security/csrf-token', {
      baseURL: process.env.REACT_APP_BASE_URL,
      withCredentials: true
    });
    csrfToken = response.data.csrfToken;
    console.log('CSRF token fetched successfully');
    return csrfToken;
  } catch (error) {
    console.warn('Failed to fetch CSRF token:', error);
    csrfToken = null;
    return null;
  } finally {
    fetchingToken = false;
  }
};

// Function to clear CSRF token
const clearCSRFToken = () => {
  csrfToken = null;
  fetchingToken = false;
};

// Avoid circular dependency by defining logout logic here
const clearUserSession = () => {
  // Clear all user-related sessionStorage items
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("userEmail");
  sessionStorage.removeItem("userFullname");
  sessionStorage.removeItem("userId");
  
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

// Request interceptor to add CSRF token to state-changing requests
api.interceptors.request.use(
  async (config) => {
    // Add CSRF token for state-changing methods, except for login/register
    const isStateChanging = config.method && ['post', 'put', 'delete', 'patch'].includes(config.method.toLowerCase());
    const isAuthEndpoint = config.url && (
      config.url.includes('/api/user/login') || 
      config.url.includes('/api/user/register') ||
      config.url.includes('/api/user/forgot-password')
    );
    
    if (isStateChanging && !isAuthEndpoint) {
      try {
        // Get CSRF token if we don't have one
        if (!csrfToken) {
          await fetchCSRFToken();
        }
        
        if (csrfToken) {
          config.headers['X-CSRF-Token'] = csrfToken;
        }
      } catch (error) {
        console.warn('Failed to add CSRF token to request:', error);
      }
    }
    
    console.log('Axios request: ', config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('Axios response: ', response)
    return response;
  },
  async (error) => {
    console.log('Axios error: ', error)
    
    // Handle CSRF token errors
    if (error.response?.status === 403 && 
        error.response?.data?.code === 'EBADCSRFTOKEN') {
      console.warn('CSRF token invalid, fetching new token...');
      
      // Clear current token and fetch new one
      clearCSRFToken();
      
      try {
        await fetchCSRFToken();
        
        // Retry the original request with new token
        if (csrfToken) {
          error.config.headers['X-CSRF-Token'] = csrfToken;
          return api.request(error.config);
        }
      } catch (csrfError) {
        console.error('Failed to refresh CSRF token:', csrfError);
        Toast.error('Security token expired. Please refresh the page.');
      }
    }
    
    if (error.response?.status === 401) {
      // Check if we're already handling a 401 error
      if (!isHandling401) {
        isHandling401 = true;
        
        const errorMessage = error.response.data?.error || error.response.data?.message || "Session expired. Please login again.";
        Toast.error(errorMessage);
        
        // Clear session and CSRF token immediately
        clearUserSession();
        clearCSRFToken();
        
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
        
        // Reset the flag after a short delay to allow for page navigation
        setTimeout(() => {
          isHandling401 = false;
        }, 1000);
      }
      
      // Mark error as handled to prevent duplicate toasts
      error.isHandledBy401Interceptor = true;
    }
    return Promise.reject(error);
  }
);

export default api;
