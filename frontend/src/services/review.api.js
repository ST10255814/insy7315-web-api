import api from "../lib/axios.js";

export async function getAdminPropertiesReviews() {
    try {
        const response = await api.get('/api/reviews', { withCredentials: true });
        return response.data.data;
    } catch (error) {
        throw error;
    }
}