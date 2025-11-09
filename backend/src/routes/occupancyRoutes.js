import express from "express";
import occupancyController from "../Controllers/occupancyController.js";
import { checkAuth } from "../middleware/checkAuth.js";
import { csrfProtection } from "../middleware/csrfProtection.js";

const router = express.Router();

// Get occupancy status for a specific listing
router.get("/:listingId/status", checkAuth, occupancyController.getOccupancyStatus);

// Update listing statuses for the authenticated admin
router.post("/update", checkAuth, csrfProtection, occupancyController.updateListingStatuses);

// Update listing statuses for all admins (system-wide)
router.post("/update-all", checkAuth, csrfProtection, occupancyController.updateAllListingStatuses);

// Get all listings status for the authenticated admin
router.get("/listing/status", checkAuth, occupancyController.getAllListingsStatus);

export default router;
