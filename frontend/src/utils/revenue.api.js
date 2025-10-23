import api from "../lib/axios";

export async function getRevenueTrend() {
    try {
        const response = await api.get('/api/revenue/trend', { withCredentials: true });
        return response.data.data;
    } catch (error) {
        throw error;
    }
}