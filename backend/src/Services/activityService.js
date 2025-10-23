import { client } from "../utils/db.js";
import Object from '../utils/ObjectIDConvert.js';
const { toObjectId } = Object;

//return recent activities for admin
async function getRecentActivities(adminId, limit = 3) {
    try {
        const db = client.db("RentWise");
        const activityCollection = db.collection("User-Activity-Logs");

        if (!adminId) {
            throw new Error("Admin ID is required");
        }

        const activities = await activityCollection
            .find({ adminId: toObjectId(adminId) })
            .sort({ timestamp: -1 })
            .limit(limit)
            .toArray();

        return activities;
    } catch (error) {
        throw new Error("Failed to retrieve recent activities: " + error.message);
    }
}

const activityService = { getRecentActivities };
export default activityService;
