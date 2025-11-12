import { client } from "../utils/db.js";
import Object from "../utils/ObjectIDConvert.js";
import { generateListingId } from "../utils/idGenerator.js";
const { toObjectId } = Object;

async function createListing(data, adminId) {
  try {
    const db = client.db("RentWise");
    const listingsCollection = db.collection("Listings");
    const userCollection = db.collection("System-Users");
    const activityCollection = db.collection("User-Activity-Logs");
    console.log("Creating listing with data:", data);

    const { title, address, description, imagesURL = [], price } = data;

    let amenities = data.amenities || [];

    if (!title || !address || !description || !price) {
      throw new Error("Title, address, description, and price are required");
    }

    // Convert price from string (FormData) to number
    const parsedPrice = Number.parseFloat(price);
    console.log(parsedPrice);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      throw new Error("Price must be a valid positive number");
    }

    if (!Array.isArray(amenities)) {
      amenities = amenities ? [amenities] : [];
    }

    amenities = [
      ...new Set(amenities.map((a) => a.trim()).filter((a) => a !== "")),
    ];

    //Fetch landlord info
    const landlord = await userCollection.findOne({ _id: toObjectId(adminId) });

    if (!landlord) {
      throw new Error("Landlord not found");
    }

    const landlordInfo = {
      userId: landlord._id,
      firstName: landlord.firstName,
      surname: landlord.surname,
      email: landlord.email,
    };

    const listingId = await generateListingId();

    const isFavourited = false; // Default value
    const status = "Vacant"; // Default value

    const newListing = {
      listingId,
      title,
      address,
      description,
      amenities,
      imagesURL,
      price: parsedPrice,
      isFavourited: isFavourited,
      status: status,
      landlordInfo,
      createdAt: new Date(),
    };

    const activityLog = {
      action: "Create Listing",
      adminId: toObjectId(adminId),
      detail: `Created listing ${listingId} with title "${title}"`,
      timestamp: new Date(),
    };
    await activityCollection.insertOne(activityLog);

    await listingsCollection.insertOne(newListing);
    return { message: "Listing created", listingId: listingId };
  } catch (error) {
    throw new Error(`Error creating listing: ${error.message}`);
  }
}

async function getListingById(listingId, adminId) {
  try {
    const db = client.db("RentWise");
    const listingsCollection = db.collection("Listings");

    // Import validation utilities
    const { validateString, validateObjectId } = await import('../utils/inputValidation.js');

    // Validate and sanitize inputs
    const safeListingId = validateString(listingId, {
      maxLength: 50,
      pattern: /^[a-zA-Z0-9\-_]+$/
    });

    const safeAdminId = validateObjectId(adminId);

    const listing = await listingsCollection.findOne({
      listingId: safeListingId,
      "landlordInfo.userId": safeAdminId,
    });

    return listing;
  } catch (error) {
    throw new Error(`Error fetching listing by ID: ${error.message}`);
  }
}

async function getListingsByAdminId(adminId) {
  try {
    const db = client.db("RentWise");
    const listingsCollection = db.collection("Listings");

    const listings = await listingsCollection
      .find({ "landlordInfo.userId": toObjectId(adminId) })
      .toArray();

    return listings;
  } catch (error) {
    throw new Error(`Error fetching listings: ${error.message}`);
  }
}

async function deleteListingById(listingId, adminId) {
  try {
    const db = client.db("RentWise");
    const listingsCollection = db.collection("Listings");
    const activityCollection = db.collection("User-Activity-Logs");

    // Import validation utilities
    const { validateString, validateObjectId } = await import('../utils/inputValidation.js');

    // Validate and sanitize inputs
    const safeListingId = validateString(listingId, {
      maxLength: 50,
      pattern: /^[a-zA-Z0-9\-_]+$/
    });

    const safeAdminId = validateObjectId(adminId);

    const result = await listingsCollection.deleteOne({
      listingId: safeListingId,
      "landlordInfo.userId": safeAdminId,
    });

    const activityLog = {
      action: "Delete Listing",
      adminId: toObjectId(adminId),
      detail: `Deleted listing ${safeListingId}`,
      timestamp: new Date(),
    };
    await activityCollection.insertOne(activityLog);

    return result.deletedCount > 0;
  } catch (error) {
    throw new Error(`Error deleting listing by ID: ${error.message}`);
  }
}

async function countNumberOfListingsByAdminId(adminId) {
  try {
    const db = client.db("RentWise");
    const listingsCollection = db.collection("Listings");

    console.log(`[countNumberOfListingsByAdminId] Counting listings for admin ${adminId}`);

    //create variable to search both landlordInfo.userId and landlordInfo.landlord (both are adminId one is just the new variant)
    const searchCriteria = {
      $or: [
        { "landlordInfo.userId": toObjectId(adminId) },
        { "landlordInfo.landlord": toObjectId(adminId) },
      ],
    };

    const count = await listingsCollection.countDocuments(searchCriteria);
    
    console.log(`[countNumberOfListingsByAdminId] Found ${count} listings for admin ${adminId}`);
    
    return count;
  } catch (error) {
    console.error(`[countNumberOfListingsByAdminId] Error counting listings: ${error.message}`);
    throw new Error(`Error counting listings: ${error.message}`);
  }
}

async function countListingsAddedThisMonth(adminId) {
  try {
    const db = client.db("RentWise");
    const listingsCollection = db.collection("Listings");

    // Get current month and year
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed (0 = January, 11 = December)

    // Create start and end dates for current month
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(
      currentYear,
      currentMonth + 1,
      0,
      23,
      59,
      59,
      999
    ); // Last day of current month

    console.log(
      `Counting listings added between ${startOfMonth} and ${endOfMonth} for admin ${adminId}`
    );

    const count = await listingsCollection.countDocuments({
      "landlordInfo.userId": toObjectId(adminId),
      createdAt: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    });

    console.log(
      `Found ${count} listings added this month for admin ${adminId}`
    );
    return count;
  } catch (error) {
    console.error(`Error counting listings added this month: ${error.message}`);
    throw new Error(
      `Error counting listings added this month: ${error.message}`
    );
  }
}

async function checkAmountOfAdminPropertiesOccupied(adminId) {
  try {
    const db = client.db("RentWise");
    const listingsCollection = db.collection("Listings");

    const count = await listingsCollection.countDocuments({
      "landlordInfo.userId": toObjectId(adminId),
      status: "Occupied",
    });
    return count;
  } catch (error) {
    console.error(`Error checking occupied properties: ${error.message}`);
    throw new Error(`Error checking occupied properties: ${error.message}`);
  }
}

async function checkAmountOfAdminPropertiesVacant(adminId) {
  try {
    const db = client.db("RentWise");
    const listingsCollection = db.collection("Listings");

    const count = await listingsCollection.countDocuments({
      "landlordInfo.userId": toObjectId(adminId),
      status: "Vacant",
    });
    return count;
  } catch (error) {
    console.error(`Error checking vacant properties: ${error.message}`);
    throw new Error(`Error checking vacant properties: ${error.message}`);
  }
}

async function checkAmountOfAdminPropertiesUnderMaintenance(adminId) {
  try {
    const db = client.db("RentWise");
    const listingsCollection = db.collection("Listings");

    const count = await listingsCollection.countDocuments({
      "landlordInfo.userId": toObjectId(adminId),
      status: "Under Maintenance",
    });
    return count;
  } catch (error) {
    console.error(`Error checking properties under maintenance: ${error.message}`);
    throw new Error(`Error checking properties under maintenance: ${error.message}`);
  }
}

async function returnPropertiesByStatus(adminId) {
  try {
    const vacantCount = await checkAmountOfAdminPropertiesVacant(adminId);
    const underMaintenanceCount = await checkAmountOfAdminPropertiesUnderMaintenance(adminId);
    const activeBookingsCount = await checkAmountOfAdminPropertiesOccupied(adminId);

    return {
      vacant: vacantCount,
      underMaintenance: underMaintenanceCount,
      activeBookings: activeBookingsCount,
    };

  } catch (error) {
    console.error(`Error returning properties by status: ${error.message}`);
    throw new Error(`Error returning properties by status: ${error.message}`);
  }
}

//update listing info
async function updateListingInfo(listingId, adminId, updateData){
  try{
    const db = client.db("RentWise");
    const listingsCollection = db.collection("Listings");

    const {title, address, description, amenities, imagesURL = [], price, status} = updateData;

    const updateFields = {};

    if(title) updateFields.title = title;
    if(address) updateFields.address = address;
    if(description) updateFields.description = description;
    if(amenities) updateFields.amenities = amenities;
    // Only update imagesURL if it's provided and not empty
    if(imagesURL && imagesURL.length > 0) updateFields.imagesURL = imagesURL;
    if(price) updateFields.price = price;
    if(status) updateFields.status = status;

    await listingsCollection.updateOne(
      {
        listingId: listingId,
        "landlordInfo.userId": toObjectId(adminId)
      },
      {
        $set: updateFields
      }
    );
    return {message: "Listing updated successfully", listingId: listingId};
  } catch (error) {
    console.error(`Error updating listing info: ${error.message}`);
    throw new Error(`Error updating listing info: ${error.message}`);
  }
}

const listingService = {
  createListing,
  getListingById,
  getListingsByAdminId,
  countNumberOfListingsByAdminId,
  returnPropertiesByStatus,
  countListingsAddedThisMonth,
  deleteListingById,
  updateListingInfo,
};

export default listingService;
