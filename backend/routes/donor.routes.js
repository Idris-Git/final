import express from "express";
import { protectRoute, authorizeRoles } from "../middleware/protectRouts.js";
import {
    updateProfile,
    updateStatus,
    getMatchingRequests,
    acceptRequest,
    getDonationHistory
} from "../controllers/donor.controller.js";
import {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead
} from "../controllers/notification.controller.js";

const router = express.Router();

// Update profile
router.put("/profile", protectRoute, authorizeRoles("donor"), updateProfile);

// Update active/inactive status
router.put("/status", protectRoute, authorizeRoles("donor"), updateStatus);

// View matching blood requests
router.get("/requests", protectRoute, authorizeRoles("donor"), getMatchingRequests);

// Accept a blood request
router.put("/requests/:id/accept", protectRoute, authorizeRoles("donor"), acceptRequest);

// View donation history
router.get("/history", protectRoute, authorizeRoles("donor"), getDonationHistory);

// Notifications (static routes BEFORE :id routes)
router.get("/notifications", protectRoute, authorizeRoles("donor"), getNotifications);
router.get("/notifications/unread-count", protectRoute, authorizeRoles("donor"), getUnreadCount);
router.put("/notifications/read-all", protectRoute, authorizeRoles("donor"), markAllAsRead);
router.put("/notifications/:id/read", protectRoute, authorizeRoles("donor"), markAsRead);

export default router;
