/**
 * Review Controller
 * Contains logic for handling review-related operations
 */
import reviewService from "../Services/reviewService.js";
import { sendSuccess, sendBadRequest } from '../utils/responseHandler.js';
import { asyncHandler, getAdminId, logControllerAction } from '../utils/controllerHelpers.js';

export const getAdminReviews = asyncHandler(async (req, res) => {
  try {
    const adminId = getAdminId(req);
    
    logControllerAction('Fetch Reviews', adminId);
    
    const reviews = await reviewService.getAdminReviews(adminId);
    
    sendSuccess(res, reviews, `Successfully fetched ${reviews.length} reviews`);
  } catch (error) {
    sendBadRequest(res, error.message, error.details);
  }
});

const reviewController = {
  getAdminReviews,
};

export default reviewController;