import api from '../lib/axios.js';

export async function getCaretakersByAdminId() {
    try{
        const response = await api.get('/api/maintenance/caretakers', { withCredentials: true });
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

export async function createCaretaker(caretakerData) {
    try {
        const response = await api.post('/api/maintenance/create/caretaker', caretakerData, { withCredentials: true });
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

export async function assignCaretakerToRequest(caretakerId, maintenanceRequestId) {
    try {
        const response = await api.post('/api/maintenance/assign', { caretakerId, maintenanceRequestId }, { withCredentials: true });
        return response.data.data;
    } catch (error) {
        throw error;
    }
}