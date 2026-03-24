import Donor from "../models/donor.model.js";
import Hospital from "../models/hospital.model.js";
import Admin from "../models/admin.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.userId || !decoded.role) {
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }

        let user;
        if (decoded.role === "donor") {
            user = await Donor.findById(decoded.userId).select("-password");
        } else if (decoded.role === "hospital") {
            user = await Hospital.findById(decoded.userId).select("-password");
        } else if (decoded.role === "admin") {
            user = await Admin.findById(decoded.userId).select("-password");
        }

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        req.user = user;
        req.role = decoded.role;
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware:", error.message);
        return res.status(500).json({ error: "Internal Server error" });
    }
};

// Middleware to restrict access to specific roles
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.role)) {
            return res.status(403).json({ error: "Forbidden: You do not have permission" });
        }
        next();
    };
};
