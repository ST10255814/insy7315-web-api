import leaseService from '../Services/leaseService.js';

export const getAdminLeases = async (req, res) => {
    try {
        const adminId = req.user.userId;
        console.log(`Fetching leases for admin: ${adminId}`);
        
        if (!adminId) {
            return res.status(400).json({ error: "Admin ID not found in request" });
        }
        
        const leases = await leaseService.getLeasesByAdminId(adminId);
        console.log(`Successfully fetched ${leases.length} leases for admin ${adminId}`);
        res.status(200).json(leases);
    }
    catch (err) {
        console.error("Error in getAdminLeases controller:", err);
        res.status(500).json({ error: err.message });
    }
}

export const createLease = async (req, res) => {
    try{
        const { bookingID } = req.body;
        const adminId = req.user.userId;
        const leaseId = await leaseService.createLease(bookingID, adminId);
        res.status(201).json({ leaseId });
    }catch(error){
        console.error("Error creating lease:", error);
        res.status(500).json({ error: "Error creating lease" });
    }
}

export const updateLeaseStatuses = async (req, res) => {
    try {
        const adminId = req.user.userId;
        const updatedCount = await leaseService.updateLeaseStatusesByAdmin(adminId);
        res.status(200).json({ 
            message: `Updated ${updatedCount} lease statuses`,
            updatedCount 
        });
    } catch (error) {
        console.error("Error updating lease statuses:", error);
        res.status(500).json({ error: "Error updating lease statuses" });
    }
}

export const triggerGlobalStatusUpdate = async (req, res) => {
    try {
        const updatedCount = await leaseService.updateAllLeaseStatuses();
        res.status(200).json({ 
            message: `Global status update completed. Updated ${updatedCount} leases`,
            updatedCount 
        });
    } catch (error) {
        console.error("Error triggering global status update:", error);
        res.status(500).json({ error: "Error triggering global status update" });
    }
}

export const countActiveLeasesByAdminId = async (req, res) => {
    try {
        const adminId = req.user.userId;
        const count = await leaseService.countActiveLeasesByAdminId(adminId);
        res.status(200).json({ count });
    } catch (error) {
        console.error("Error counting active leases:", error);
        res.status(500).json({ error: "Error counting active leases" });
    }
}

const leaseController = {
    getAdminLeases,
    createLease,
    updateLeaseStatuses,
    countActiveLeasesByAdminId,
    triggerGlobalStatusUpdate
};

export default leaseController;