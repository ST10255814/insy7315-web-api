import { ObjectId } from "mongodb";
import { client } from "../utils/db.js";

function toObjectId(id) {
  if (id instanceof ObjectId) return id;
  if (typeof id === "string" && ObjectId.isValid(id)) return new ObjectId(id);
  throw new Error("Invalid id format");
}

async function getLeasesByAdminId(adminId) {
  try {
    if (!adminId) {
      throw new Error("Admin ID is required");
    }
    
    const db = client.db("RentWise");
    const leasesCollection = db.collection("Leases");

    const leases = await leasesCollection
      .find({ adminId: toObjectId(adminId) })
      .toArray();

    return leases;
  } catch (err) {
    throw new Error("Error fetching leases: " + err.message);
  }
}

//creating lease from bookingID
async function createLease(bookingID, adminId) {
  try {
    if (!bookingID) {
      throw new Error("Booking ID is required to create a lease");
    }

    const db = client.db("RentWise");
    const bookingsCollection = db.collection("Bookings");
    const userCollection = db.collection('System-Users');
    const leasesCollection = db.collection("Leases");

    // Verify booking exists
    const booking = await bookingsCollection.findOne({ _id: toObjectId(bookingID) });
    if (!booking) {
      throw new Error("Booking not found");
    }

    //extract both userID and listingID from bookingsCollection
    const userID = await userCollection.findOne({ _id: toObjectId(booking.userId) });

    if(!userID){
      throw new Error("User not found");
    }

    //create tenant Object
    const tenant = {
        userId: userID._id,
        //firstName: userID.firstName,
        //surname: userID.surname,
        fullname: userID.name,
        email: userID.email
    }

    //create listing object with address 
    const listing = {
        listingId : booking.listingDetail.listingID,
        address: booking.listingDetail.address
    }

    //create booking details object with startDate, endDate and rentAmount
    const bookingDetails = {
        bookingId: booking._id,
        startDate: booking.newBooking.checkInDate,
        endDate: booking.newBooking.checkOutDate,
        rentAmount: booking.newBooking.totalPrice
    }

    const lease = {
        adminId: toObjectId(adminId),
        bookingDetails,
        tenant,
        listing,
        status: "Pending",
        leaseCreatedAt: new Date()
    };

    const result = await leasesCollection.insertOne(lease);
    return result.insertedId;
  } catch (err) {
    throw new Error("Error creating lease: " + err.message);
  }
}

const leaseService = {
    getLeasesByAdminId,
    createLease
};

export default leaseService;