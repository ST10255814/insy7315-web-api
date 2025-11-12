import api from "../lib/axios.js";

// Get all invoices via adminId
export async function getInvoicesByAdminId() {
    try{
        const response = await api.get('/api/invoices', { withCredentials: true });
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

export async function createInvoice(invoiceData) {
    try {
        const response = await api.post('/api/invoices/create', invoiceData, { withCredentials: true });
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

export async function deleteInvoice(invoiceId) {
    try {
        const response = await api.delete(`/api/invoices/${invoiceId}`, { withCredentials: true });
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

export async function getInvoiceById(invoiceId) {
    try {
        const response = await api.get(`/api/invoices/${invoiceId}`, { withCredentials: true });
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

export async function getInvoiceByIdForPreview(invoiceId) {
    try {
        const response = await api.get(`/api/invoices/data/${invoiceId}`, { withCredentials: true });
        return response.data.data;
    } catch (error) {
        throw error;
    }
};