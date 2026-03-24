import express from "express";
import { signup, login, logout, getMe } from "../controllers/auth.controller.js";
import { protectRoute, authorizeRoles } from "../middleware/protectRouts.js";

const router = express.Router();

router.get("/me", protectRoute, authorizeRoles("donor"), getMe);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;
