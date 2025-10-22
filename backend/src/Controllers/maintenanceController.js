import maintenanceService from "../Services/maintenanceService.js";

export const getAllMaintenanceRequests = async (req, res) => {
  try {
    const adminId = req.user.userId;
    console.log(`Fetching maintenance requests for admin: ${adminId}`);
    const requests = await maintenanceService.getAllMaintenanceRequests(adminId);
    res.status(200).json(requests);
  } catch (error) {
    console.error(`Error fetching maintenance requests: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const maintenanceController = {
  getAllMaintenanceRequests,
};
export default maintenanceController;