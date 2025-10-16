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
import leaseService from '../Services/leaseService.js';

//controller to handle lease creation
export const createLease = async (req, res) => {
    try{
        const { bookingID } = req.body;
        const leaseId = await leaseService.createLease(bookingID);
        res.status(201).json({ leaseId });
    }catch(error){
        console.error("Error creating lease:", error);
        res.status(500).json({ error: "Error creating lease" });
    }
}