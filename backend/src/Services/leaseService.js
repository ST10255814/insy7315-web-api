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

    const bookingIDGenerated = await generateBookingId();

    //create booking details object with startDate, endDate and rentAmount
    const bookingDetails = {
        bookingId: bookingIDGenerated,
        startDate: booking.newBooking.checkInDate,
        endDate: booking.newBooking.checkOutDate,
        rentAmount: booking.newBooking.totalPrice
    }

    // Generate the lease ID
    const leaseId = await generateLeaseId();
    

    const lease = {
        adminId: toObjectId(adminId),
        leaseId: leaseId,
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

//auto ID generation for leases
//ID format example L-0001, L-0002, etc.
async function generateLeaseId() {
  try {
    const db = client.db("RentWise");
    const leasesCollection = db.collection("Leases");

    // Find the lease with the highest leaseId number
    const lastLease = await leasesCollection
      .findOne(
        { leaseId: { $exists: true } },
        { sort: { leaseId: -1 } }
      );

    let nextNumber = 1;
    
    if (lastLease && lastLease.leaseId) {
      // Extract the number from the lease ID (e.g., "L-0001" -> 1)
      const lastNumber = parseInt(lastLease.leaseId.split('-')[1]);
      nextNumber = lastNumber + 1;
    }

    // Format the number with leading zeros (4 digits)
    const formattedNumber = nextNumber.toString().padStart(4, '0');
    return `L-${formattedNumber}`;
  } catch (err) {
    throw new Error("Error generating lease ID: " + err.message);
  }
}

//auto ID generation for bookings
//ID format example B-0001, B-0002, etc.
async function generateBookingId() {
  try {
    const db = client.db("RentWise");
    const bookingsCollection = db.collection("Bookings");

    // Find the booking with the highest bookingId number
    const lastBooking = await bookingsCollection
      .findOne(
        { bookingId: { $exists: true } },
        { sort: { bookingId: -1 } }
      );

    let nextNumber = 1;

    if (lastBooking && lastBooking.bookingId) {
      // Extract the number from the booking ID (e.g., "B-0001" -> 1)
      const lastNumber = parseInt(lastBooking.bookingId.split('-')[1]);
      nextNumber = lastNumber + 1;
    }

    // Format the number with leading zeros (4 digits)
    const formattedNumber = nextNumber.toString().padStart(4, '0');
    return `B-${formattedNumber}`;
  } catch (err) {
    throw new Error("Error generating booking ID: " + err.message);
  }
}

    const lastLease = await leasesCollection
      .findOne(
        { leaseId: { $exists: true } },
        { sort: { leaseId: -1 } }
      );

    let nextNumber = 1;
    
    if (lastLease && lastLease.leaseId) {
      // Extract the number from the lease ID (e.g., "L-0001" -> 1)
      const lastNumber = parseInt(lastLease.leaseId.split('-')[1]);
      nextNumber = lastNumber + 1;
    }

    // Format the number with leading zeros (4 digits)
    const formattedNumber = nextNumber.toString().padStart(4, '0');
    return `L-${formattedNumber}`;
  } catch (err) {
    throw new Error("Error generating lease ID: " + err.message);
  }
}


const leaseService = {
    getLeasesByAdminId,
    createLease,
    generateLeaseId
};

export default leaseService;