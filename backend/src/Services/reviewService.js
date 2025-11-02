import { client } from "../utils/db.js";
import Object from '../utils/ObjectIDConvert.js';
const { toObjectId } = Object;

/**
 * Review Service
 * Contains business logic for review-related operations
 */

// Fetch all reviews for a given admin's properties
export const getAdminReviews = async (adminId) => {
  try {
    const db = client.db("RentWise");
    const reviewsCollection = db.collection("Reviews");
    const listingsCollection = db.collection("Listings");
    const usersCollection = db.collection("System-Users");

    // Find all listings managed by the admin
    const adminListings = await listingsCollection.find({ "landlordInfo.userId": toObjectId(adminId) }).toArray();
    const listingIds = adminListings.map(listing => listing._id);

    // Fetch all reviews for those listings
    const listingReviewsForAdmin = await reviewsCollection.find({ listingId: { $in: listingIds } }).toArray();

    const userInfo = await usersCollection.find({ _id: { $in: listingReviewsForAdmin.map(user => user.userId) } }).toArray();

    // Map user info to reviews
    const reviewsWithUserInfo = listingReviewsForAdmin.map(review => {
      const user = userInfo.find(u => u._id.toString() === review.userId.toString());
      const property = adminListings.find(l => l._id.toString() === review.listingId.toString());
      return {
        ...review,
        fullname: user ? user.firstName + " " + user.surname : "Unknown User",
        property: property ? property.title : "Unknown Property"
      };
    });

    return reviewsWithUserInfo;

  } catch (err) {
    throw new Error("Error fetching reviews: " + err.message);
  }
};

const reviewService = {
  getAdminReviews,
};

export default reviewService;