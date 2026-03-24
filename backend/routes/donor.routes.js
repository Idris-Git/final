import express from "express";
import { protectRoute, authorizeRoles } from "../middleware/protectRouts.js";
import {
    updateStatus,
    getMatchingRequests,
    acceptRequest,
    getDonationHistory
} from "../controllers/donor.controller.js";

const router = express.Router();

// Update active/inactive status
router.put("/status", protectRoute, authorizeRoles("donor"), updateStatus);

// View matching blood requests
router.get("/requests", protectRoute, authorizeRoles("donor"), getMatchingRequests);

// Accept a blood request
router.put("/requests/:id/accept", protectRoute, authorizeRoles("donor"), acceptRequest);

// View donation history
router.get("/history", protectRoute, authorizeRoles("donor"), getDonationHistory);

export default router;
