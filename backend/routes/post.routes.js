import express from "express";
import { getAllPosts } from "../controllers/post.controller.js";

const router = express.Router();

// Public route - no auth required
router.get("/", getAllPosts);

export default router;
