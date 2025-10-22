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

    if(!requests || requests.length === 0){
      return []; // Return empty array instead of throwing error
    }

    // Process each maintenance request in the array
    const maintenanceRequests = [];
    
    for (const request of requests) {
      try {
        // Get user information for this specific request
        let user = null;
        if (request.userId) {
          user = await userCollection.findOne({
            _id: toObjectId(request.userId),
          });
        }
        // Create formatted maintenance request object
        const formattedRequest = {
          maintenanceID: request.newMaintenanceRequest?.maintenanceId || request._id,
          issue: request.newMaintenanceRequest?.issue,
          description: request.newMaintenanceRequest?.description,
          priority: request.newMaintenanceRequest?.priority || "medium",
          status: request.newMaintenanceRequest?.status || "pending",
          documentURL: request.newMaintenanceRequest?.documentURL,
          createdAt: request.newMaintenanceRequest?.createdAt || request.createdAt,
          property: request.listingDetail?.address,
          tenantName: user ? `${user.firstName} ${user.surname}` : "Unknown Tenant",
        };

        maintenanceRequests.push(formattedRequest);
      } catch (requestError) {
        throw new Error(`Error processing request ${request._id}: ${requestError.message}`);
      }
    }

    return maintenanceRequests;
  } catch (error) {
    throw new Error(`Error fetching maintenance requests: ${error.message}`);
  }
}

const maintenanceService = {
  getAllMaintenanceRequests,
};
export default maintenanceService;
