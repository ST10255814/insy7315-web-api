import activityService from "../Services/activityService.js";

export const getRecentActivities = async (req, res) => {
    try {
        const adminId = req.user.userId;
        const activities = await activityService.getRecentActivities(adminId);
        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const activityController = { getRecentActivities };
export default activityController;