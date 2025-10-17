import axios from "axios"
import Toast from "./toast";
import { logoutUser } from "../utils/user.api";

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
      Toast.error(error.response.data?.error || "Session expired");
      // Clear local token / session
      await logoutUser();
      window.location.href = "/login"; // force reload to login page
    }
    return Promise.reject(error);
  }
);

export default api;
