import api from "../lib/axios";

// Get all invoices via adminId
export async function getInvoicesByAdminId() {
    try{
        const response = await api.get('/api/invoices', { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error;
    }
}