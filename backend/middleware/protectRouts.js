import Donor from "../models/donor.model.js";
import jwt from "jsonwebtoken";
export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.donorId) {
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }

        const donor = await Donor.findById(decoded.donorId).select("-password");
        if (!donor) {
            return res.status(404).json({ error: "User not found" });
        }
        req.donor = donor;
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware:", error.message);
        return res.status(500).json({ error: "Internal Server error" });
    }
}