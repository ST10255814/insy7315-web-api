import axios from "axios"

const api = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {'Content-Type': 'application/json'},
    withCredentials: true
})

api.interceptors.response.use(
  (response) => {
    console.log("Axios response:", response);
    return response;
  },
  (error) => {
    console.log("Axios intercepted error:", error.response?.status, error.response?.data);
    throw error; 
  }
);

export default api;