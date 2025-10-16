import api from "../lib/axios.js";
import Toast from "../lib/toast.js";

export async function logoutUser() {
  try {
    const response = await api.post('/api/user/logout', {}, { withCredentials: true });
    Toast.success(response.data.message)
    return response.data;
  } catch (error) {
    if (error.response) {
        Toast.error(error.response.data.error)
    } 
    throw error;
  }
}
