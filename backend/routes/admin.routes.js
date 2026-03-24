import express from "express";
import { protectRoute, authorizeRoles } from "../middleware/protectRouts.js";
import {
    login,
    logout,
    getMe,
    getAllHospitals,
    approveHospital,
    removeHospital,
    getAllDonors,
    removeDonor,
    getAllRequests,
    getReports,
    createPost,
    deletePost
} from "../controllers/admin.controller.js";

const router = express.Router();

// Auth
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protectRoute, authorizeRoles("admin"), getMe);

// Hospital management
router.get("/hospitals", protectRoute, authorizeRoles("admin"), getAllHospitals);
router.put("/hospitals/:id/approve", protectRoute, authorizeRoles("admin"), approveHospital);
router.delete("/hospitals/:id", protectRoute, authorizeRoles("admin"), removeHospital);

// Donor management
router.get("/donors", protectRoute, authorizeRoles("admin"), getAllDonors);
router.delete("/donors/:id", protectRoute, authorizeRoles("admin"), removeDonor);

// Blood requests
router.get("/requests", protectRoute, authorizeRoles("admin"), getAllRequests);

// Reports
router.get("/reports", protectRoute, authorizeRoles("admin"), getReports);

// Posts (Announcements)
router.post("/posts", protectRoute, authorizeRoles("admin"), createPost);
router.delete("/posts/:id", protectRoute, authorizeRoles("admin"), deletePost);

export default router;
