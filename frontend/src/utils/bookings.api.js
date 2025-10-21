import api from "../lib/axios";

// Get all bookings via adminId
export async function getBookingsByAdminId() {
    try{
        const response = await api.get('/api/bookings', { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error;
    }
}