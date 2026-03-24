import express from "express";
import { protectRoute, authorizeRoles } from "../middleware/protectRouts.js";
import {
    signup,
    login,
    logout,
    getMe,
    createBloodRequest,
    getHospitalRequests,
    completeRequest,
    searchDonors
} from "../controllers/hospital.controller.js";

const router = express.Router();

// Auth
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protectRoute, authorizeRoles("hospital"), getMe);

// Blood requests
router.post("/requests", protectRoute, authorizeRoles("hospital"), createBloodRequest);
router.get("/requests", protectRoute, authorizeRoles("hospital"), getHospitalRequests);
router.put("/requests/:id/complete", protectRoute, authorizeRoles("hospital"), completeRequest);

// Search donors
router.get("/donors", protectRoute, authorizeRoles("hospital"), searchDonors);

export default router;
