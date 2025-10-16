import leaseService from '../Services/leaseService.js';

export const getAdminLeases = async (req, res) => {
    try {
        const adminId = req.user.userId;
        const leases = await leaseService.getLeasesByAdminId(adminId);
        res.status(200).json(leases);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const leaseController = {
    getAdminLeases
};

export default leaseController;