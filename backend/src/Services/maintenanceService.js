import { client } from "../utils/db.js";
import Object from "../utils/ObjectIDConvert.js";
const { toObjectId } = Object;

//get all maintenance requests for the admin
async function getAllMaintenanceRequests(adminId) {
  try {
    const db = client.db("RentWise");
    const MaintenanceCollection = db.collection("Maintenance-Requests");
    const userCollection = db.collection("System-Users");

    //check if adminId is provided
    if (!adminId) {
      throw new Error("Admin ID is required");
    }

    //fetch all Maintenance Requests for the admin
    const requests = await MaintenanceCollection.find({
      "listingDetail.landlordID": toObjectId(adminId),
    }).toArray();

    const user = await userCollection.findOne({
      _id: requests.userId,
    });

    //create requests object
    const maintenanceRequests = {
      maintenanceID: requests.newMaintenanceRequest.maintenanceId,
      issue: requests.newMaintenanceRequest.issue,
      description: requests.newMaintenanceRequest.description,
      priority: requests.newMaintenanceRequest.priority,
      documentURL: requests.newMaintenanceRequest.documentURL,
      createdAt: requests.newMaintenanceRequest.createdAt,
      property: requests.listingDetail.address,
      tenantName: user ? `${user.firstName} ${user.surname}` : "Unknown Tenant",
    };

    return maintenanceRequests;
  } catch (error) {
    throw new Error(`Error fetching maintenance requests: ${error.message}`);
  }
}

const maintenanceService = {
  getAllMaintenanceRequests,
};
export default maintenanceService;
