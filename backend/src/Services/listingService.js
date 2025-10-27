import { client } from "../utils/db.js";
import Object from '../utils/ObjectIDConvert.js';
import { generateListingId } from '../utils/idGenerator.js';
const { toObjectId } = Object;

async function createListing(data, adminId) {
     try {
        const db = client.db('RentWise');
        const listingsCollection = db.collection('Listings');
        const userCollection = db.collection('System-Users');
        const activityCollection = db.collection("User-Activity-Logs");

        const { title, address, description, imagesURL = [], price} = data;

        let amenities = data.amenities || [];
        if (!title || !address || !description || !price) {
        throw new Error('Title, address, description, and price are required');
        }

        // Convert price from string (FormData) to number
        const parsedPrice = Number.parseFloat(price);
        if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
        throw new TypeError('Price must be a valid positive number');
        }

        if (!Array.isArray(amenities)) {
        amenities = amenities ? [amenities] : [];
        }

        amenities = [...new Set(amenities.map(a => a.trim()).filter(a => a !== ''))];

        //Fetch landlord info
        const landlord = await userCollection.findOne({ _id: toObjectId(adminId) });

        if (!landlord) {
        throw new Error('Landlord not found');
        }

        const landlordInfo = {
            userId: landlord._id,
            firstName: landlord.firstName,
            surname: landlord.surname,
            email: landlord.email
        };

        const listingId = await generateListingId();

        const isFavourited = false; // Default value
        const status = 'Vacant'; // Default value

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
            createdAt: new Date()
        };

        const activityLog = {
            action: 'Create Listing',
            adminId: toObjectId(adminId),
            detail: `Created listing ${listingId} with title "${title}"`,
            timestamp: new Date()
        };
        await activityCollection.insertOne(activityLog);

        const result = await listingsCollection.insertOne(newListing);
        return { message: 'Listing created', listingId: result.insertedId };

  } catch (error) {
    throw new Error(`Error creating listing: ${error.message}`);
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

async function countNumberOfListingsByAdminId(adminId) {
  try{
    const db = client.db("RentWise");
    const listingsCollection = db.collection("Listings");

    const count = await listingsCollection.countDocuments({ "landlordInfo.userId": toObjectId(adminId) });
    return count;
  } catch (error) {
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
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999); // Last day of current month

    console.log(`Counting listings added between ${startOfMonth} and ${endOfMonth} for admin ${adminId}`);

    const count = await listingsCollection.countDocuments({ 
      "landlordInfo.userId": toObjectId(adminId),
      "createdAt": {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    });

    console.log(`Found ${count} listings added this month for admin ${adminId}`);
    return count;
  } catch (error) {
    console.error(`Error counting listings added this month: ${error.message}`);
    throw new Error(`Error counting listings added this month: ${error.message}`);
  }
}

const listingService = { 
  createListing, 
  getListingsByAdminId, 
  countNumberOfListingsByAdminId, 
  countListingsAddedThisMonth 
};
export default listingService;