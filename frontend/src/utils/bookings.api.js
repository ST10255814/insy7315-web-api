import api from "../lib/axios";

// Get all bookings via adminId
export async function getBookingsByAdminId() {
    try{
        const response = await api.get('/api/bookings', { withCredentials: true });
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

// Get current month revenue for the logged-in admin
export async function getCurrentMonthRevenue() {
    try {
        const response = await api.get('/api/bookings/current-month-revenue', {
            withCredentials: true
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
}


