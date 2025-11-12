import { client } from "../utils/db.js";
import Object from "../utils/ObjectIDConvert.js";
import { generateCareTakerId } from "../utils/idGenerator.js";
import { validateEmail, validateFullname, sanitizeInput, validateId } from "../utils/validation.js";
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
          notes: request.newMaintenanceRequest?.caretakerNotes || "",
          followUps: request.newMaintenanceRequest?.followUps || 0,
          createdAt: request.newMaintenanceRequest?.createdAt || request.createdAt,
          updatedAt: request.newMaintenanceRequest?.updatedAt || request.updatedAt,
          property: request.listingDetail?.address,
          tenantName: user ? `${user.firstName} ${user.surname}` : "Unknown Tenant",
          careTaker: request.newMaintenanceRequest?.caretakerId || null,
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

//count total maintenance requests for an admin
async function countMaintenanceRequestsByAdminId(adminId) {
  try {
    const db = client.db("RentWise");
    const MaintenanceCollection = db.collection("Maintenance-Requests");

    const count = await MaintenanceCollection.countDocuments({
      "listingDetail.landlordID": toObjectId(adminId),
    });

    return count;
  } catch (error) {
    throw new Error(`Error counting maintenance requests: ${error.message}`);
  }
}

//count all maintenance requests with high priority for an admin
async function countHighPriorityMaintenanceRequestsByAdminId(adminId) {
  try {
    const db = client.db("RentWise");
    const MaintenanceCollection = db.collection("Maintenance-Requests");

    const count = await MaintenanceCollection.countDocuments({
      "listingDetail.landlordID": toObjectId(adminId),
      "newMaintenanceRequest.priority": { $in: ["high", "High"] },
    });

    return count;
  } catch (error) {
    throw new Error(`Error counting high priority maintenance requests: ${error.message}`);
  }
}

async function createCareTaker(adminId, careTakerData){
  try {
    const db = client.db("RentWise");
    const userCollection = db.collection("Care-Takers");

    // Validate adminId
    if(!adminId){
      throw new Error("Admin ID is required");
    }
    if(!validateId(adminId)){
      throw new Error("Invalid admin ID format");
    }

    // Extract and validate required fields
    const { firstName, surname, email, phoneNumber, profession } = careTakerData;
    
    if(!firstName || !surname || !email || !phoneNumber || !profession){
      throw new Error("All caretaker fields are required");
    }

    // Validate email format and security
    if(!validateEmail(email)){
      throw new Error("Invalid email format or contains security threats");
    }

    // Validate names for security threats
    if(!validateFullname(firstName) || !validateFullname(surname)){
      throw new Error("Name contains invalid characters or security threats");
    }

    // Sanitize all input fields to prevent XSS and injection attacks
    const sanitizedFirstName = sanitizeInput(firstName.trim());
    const sanitizedSurname = sanitizeInput(surname.trim());
    const sanitizedEmail = sanitizeInput(email.trim().toLowerCase());
    const sanitizedPhoneNumber = sanitizeInput(phoneNumber.trim());
    const sanitizedProfession = sanitizeInput(profession.trim());

    // Additional validation for phone number (basic format check)
    const phonePattern = /^[+]?[0-9\s\-()]{7,15}$/;
    if(!phonePattern.test(sanitizedPhoneNumber)){
      throw new Error("Invalid phone number format");
    }

    const role = "caretaker";
    const caretakerId = await generateCareTakerId();
    
    // Create caretaker object with sanitized data
    const caretaker = {
      adminId: toObjectId(adminId),
      caretakerId: caretakerId,
      firstName: sanitizedFirstName,
      surname: sanitizedSurname,
      email: sanitizedEmail,
      phoneNumber: sanitizedPhoneNumber,
      profession: sanitizedProfession,
      role: role
    };

    await userCollection.insertOne(caretaker);
    return caretaker.caretakerId;

    }catch (error) {
    throw new Error(`Error creating caretaker: ${error.message}`);
    }
  }

  async function getAllAdminsCareTakers(adminId){
    try{
      const db = client.db("RentWise");
      const userCollection = db.collection("Care-Takers");

      const caretakers = await userCollection.find({ adminId: toObjectId(adminId) }).toArray();
      return caretakers;
    }catch (error) {
      throw new Error(`Error fetching caretakers: ${error.message}`);
    }
  }

  async function assignCareTakerToRequest(caretakerId, maintenanceRequestId, adminId){
    try{
      const db = client.db("RentWise");
      const maintenanceCollection = db.collection("Maintenance-Requests");
      const userCollection = db.collection("Care-Takers");
      const listingCollection = db.collection("Listings");

      // Import validation utilities
      const { validateString, validateObjectId } = await import('../utils/inputValidation.js');

      // Validate and sanitize inputs
      const safeCaretakerId = validateString(caretakerId, {
        maxLength: 50,
        pattern: /^[a-zA-Z0-9\-_]+$/
      });

      const safeMaintenanceRequestId = validateString(maintenanceRequestId, {
        maxLength: 50,
        pattern: /^[a-zA-Z0-9\-_]+$/
      });

      const safeAdminId = validateObjectId(adminId);

      //verify caretaker belongs to admin
      const caretaker = await userCollection.findOne({ 
        caretakerId: safeCaretakerId, 
        adminId: safeAdminId 
      });
      if(!caretaker){
        throw new Error("Caretaker not found for this admin");
      }

      //verify maintenance request belongs to admin
      const maintenanceRequest = await maintenanceCollection.findOne({ 
        "newMaintenanceRequest.maintenanceId": safeMaintenanceRequestId, 
        "listingDetail.landlordID": safeAdminId 
      });
      if(!maintenanceRequest){
        throw new Error("Maintenance request not found for this admin");
      }

      // Validate and sanitize inputs to prevent NoSQL injection
      if (!maintenanceRequestId || typeof maintenanceRequestId !== 'string') {
        throw new Error("Invalid maintenance request ID");
      }
      if (!caretakerId || typeof caretakerId !== 'string') {
        throw new Error("Invalid caretaker ID");
      }

      const sanitizedMaintenanceId = maintenanceRequestId.replace(/[^a-zA-Z0-9_-]/g, '');
      const sanitizedCaretakerId = caretakerId.replace(/[^a-zA-Z0-9_-]/g, '');

      //assign caretaker to maintenance request & update maintenance status to 'in progress'
      await maintenanceCollection.updateOne(
        { "newMaintenanceRequest.maintenanceId": sanitizedMaintenanceId },
        { $set: { "newMaintenanceRequest.caretakerId": sanitizedCaretakerId, "newMaintenanceRequest.status": "In Progress", "newMaintenanceRequest.updatedAt": new Date() } }
      );

      //update listing status to 'under maintenance'
      await listingCollection.updateOne(
        { listingId: maintenanceRequest.listingDetail.listingID },
        { $set: { status: "Under Maintenance" } }
      );

    }catch (error) {
      throw new Error(`Error assigning caretaker to maintenance request: ${error.message}`);
    }
  }

  async function updateMaintenanceRequest(maintenanceRequestId, adminId, updateData){
    try{
      const db = client.db("RentWise");
      const maintenanceCollection = db.collection("Maintenance-Requests");
      
      // Validate inputs
      if (!maintenanceRequestId) {
        throw new Error("Maintenance request ID is required");
      }
      if (!adminId) {
        throw new Error("Admin ID is required");
      }
      if (!updateData) {
        throw new Error("Update data is required");
      }

      // First verify the maintenance request exists and belongs to the admin
      const existingRequest = await maintenanceCollection.findOne({
        "newMaintenanceRequest.maintenanceId": maintenanceRequestId,
        "listingDetail.landlordID": toObjectId(adminId)
      });

      if (!existingRequest) {
        throw new Error("Maintenance request not found for this admin");
      }
      
      //update 2 specific fields: followUps and caretakerNotes
      const { followUps, caretakerNotes } = updateData;
      const updateFields = {};

      if(followUps){
        updateFields["newMaintenanceRequest.followUps"] = followUps;
      }
      if(caretakerNotes){
        updateFields["newMaintenanceRequest.caretakerNotes"] = caretakerNotes;
      }
      
      if(globalThis.Object.keys(updateFields).length > 0){
        updateFields["newMaintenanceRequest.updatedAt"] = new Date();
        
        const result = await maintenanceCollection.updateOne(
          { 
            "newMaintenanceRequest.maintenanceId": maintenanceRequestId,
            "listingDetail.landlordID": toObjectId(adminId)
          },
          { $set: updateFields }
        );

        if (result.matchedCount === 0) {
          throw new Error("Maintenance request not found or access denied");
        }

        if (result.modifiedCount === 0) {
          throw new Error("No changes were made to the maintenance request");
        }

        return {
          success: true,
          message: "Maintenance request updated successfully",
          modifiedCount: result.modifiedCount
        };
      } else {
        throw new Error("No valid fields provided for update");
      }
    }catch (error) {
      throw new Error(`Error updating maintenance request: ${error.message}`);
    }
  }

  async function updateMaintenanceStatusToCompleted(maintenanceRequestId, adminId){
    try{
      const db = client.db("RentWise");
      const maintenanceCollection = db.collection("Maintenance-Requests");
      const listingCollection = db.collection("Listings");
      //make sure maintenance request exists
      const maintenanceRequest = await maintenanceCollection.findOne({ 
        "newMaintenanceRequest.maintenanceId": maintenanceRequestId, 
        "listingDetail.landlordID": toObjectId(adminId) 
      });
      if(!maintenanceRequest){
        throw new Error("Maintenance request not found for this admin");
      }
      //update maintenance request status to completed
      await maintenanceCollection.updateOne(
        { "newMaintenanceRequest.maintenanceId": maintenanceRequestId },
        { $set: { "newMaintenanceRequest.status": "Completed", "newMaintenanceRequest.updatedAt": new Date() } }
      );
      //update listing status to vacant if no active leases, else to occupied
      const listingId = maintenanceRequest.listingDetail.listingID;
      const activeLeases = await db.collection("Leases").countDocuments({
        listingId: listingId,
        status: "active"
      });
      
      const newStatus = activeLeases > 0 ? "Occupied" : "Vacant";
      await listingCollection.updateOne(
        { listingId: listingId },
        { $set: { status: newStatus } }
      );
    }catch (error) {
      throw new Error(`Error updating maintenance request status: ${error.message}`);
    }
  }

  async function deleteCareTaker(caretakerId, adminId){
    try{
      const db = client.db("RentWise");
      const userCollection = db.collection("Care-Takers");

      const result = await userCollection.deleteOne({ 
        caretakerId: caretakerId, 
        adminId: toObjectId(adminId) 
      });
      if(result.deletedCount === 0){
        throw new Error("Caretaker not found or access denied");
      }
    }catch (error) {
      throw new Error(`Error deleting caretaker: ${error.message}`);
    }
  }

const maintenanceService = {
  getAllMaintenanceRequests,
  countMaintenanceRequestsByAdminId,
  countHighPriorityMaintenanceRequestsByAdminId,
  createCareTaker,
  getAllAdminsCareTakers,
  assignCareTakerToRequest,
  updateMaintenanceRequest,
  updateMaintenanceStatusToCompleted,
  deleteCareTaker
};
export default maintenanceService;
