import { client } from "../utils/db.js";
import Object from '../utils/ObjectIDConvert.js';
import { generateListingId } from '../utils/idGenerator.js';
const { toObjectId } = Object;

async function createListing(data, adminId) {
     try {
        const db = client.db('RentWise');
        const listingsCollection = db.collection('Listings');
        const userCollection = db.collection('System-Users');

        const { title, address, description, imagesURL = [], price} = data;

        let amenities = data.amenities || [];
        if (!title || !address || !description || !price) {
        throw new Error('Title, address, description, and price are required');
        }

        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice)) {
        throw new Error('Price must be a valid number');
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

const listingService = { createListing, getListingsByAdminId, countNumberOfListingsByAdminId };
export default listingService;