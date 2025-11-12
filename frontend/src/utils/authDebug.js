/**
 * Authentication debugging utilities
 * Use these functions to debug authentication issues
 */

import api from "../lib/axios.js";

/**
 * Check current authentication status
 * Call this from browser console: window.checkAuth()
 */
export const checkAuthStatus = async () => {
  console.log('🔍 Starting Authentication Debug Check...');
  
  // Check session storage
  const sessionData = {
    user: sessionStorage.getItem('user'),
    userId: sessionStorage.getItem('userId'),
    userEmail: sessionStorage.getItem('userEmail'),
    userFullname: sessionStorage.getItem('userFullname')
  };
  
  console.log('📱 Session Storage:', sessionData);
  console.log('🍪 Document Cookies:', document.cookie);
  console.log('🌐 Current Origin:', window.location.origin);
  
  // Test API endpoints
  const results = {};
  
  try {
    console.log('🧪 Testing basic connection...');
    const basicTest = await api.get('/');
    results.basicConnection = { success: true, data: basicTest.data };
    console.log('✅ Basic connection successful');
  } catch (error) {
    results.basicConnection = { success: false, error: error.message };
    console.log('❌ Basic connection failed:', error.message);
  }
  
  try {
    console.log('🧪 Testing auth debug endpoint...');
    const authDebug = await api.get('/api/user/auth-debug');
    results.authDebug = { success: true, data: authDebug.data };
    console.log('✅ Auth debug successful:', authDebug.data);
  } catch (error) {
    results.authDebug = { success: false, error: error.message };
    console.log('❌ Auth debug failed:', error.message);
  }
  
  try {
    console.log('🧪 Testing CSRF token...');
    const csrfTest = await api.get('/api/security/csrf-token');
    results.csrfToken = { success: true, data: csrfTest.data };
    console.log('✅ CSRF token successful');
  } catch (error) {
    results.csrfToken = { success: false, error: error.message };
    console.log('❌ CSRF token failed:', error.message);
  }
  
  try {
    console.log('🧪 Testing protected endpoint (leases count)...');
    const protectedTest = await api.get('/api/leases/count');
    results.protectedEndpoint = { success: true, data: protectedTest.data };
    console.log('✅ Protected endpoint successful');
  } catch (error) {
    results.protectedEndpoint = { success: false, error: error.message };
    console.log('❌ Protected endpoint failed:', error.message);
  }
  
  console.log('🎯 Final Results:', results);
  
  return {
    sessionData,
    cookies: document.cookie,
    origin: window.location.origin,
    tests: results
  };
};

/**
 * Quick authentication status check
 */
export const isUserLoggedIn = () => {
  const userId = sessionStorage.getItem('userId');
  const user = sessionStorage.getItem('user');
  const hasCookies = document.cookie.includes('authToken');
  
  return {
    hasSessionData: !!(userId && user),
    hasAuthCookie: hasCookies,
    isAuthenticated: !!(userId && user && hasCookies)
  };
};

// Make functions available in window for console debugging
if (typeof window !== 'undefined') {
  window.checkAuth = checkAuthStatus;
  window.isLoggedIn = isUserLoggedIn;
}