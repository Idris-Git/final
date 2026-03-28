import Admin from "../models/admin.model.js";
import Hospital from "../models/hospital.model.js";
import Donor from "../models/donor.model.js";
import BloodRequest from "../models/bloodR.modle.js";
import Post from "../models/post.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import cloudinary from "../lib/utils/cloudinary.js";

// ---- AUTH ----

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        const isPasswordCorrect = await bcrypt.compare(password, admin?.password || "");
        if (!admin || !isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        generateTokenAndSetCookie(admin._id, "admin", res);
        res.status(200).json({
            _id: admin._id,
            name: admin.name,
            email: admin.email
        });
    } catch (error) {
        console.log("Error in admin login:", error.message);
        res.status(500).json({ error: "Internal Server error" });
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in admin logout:", error.message);
        res.status(500).json({ error: "Internal Server error" });
    }
};

export const getMe = async (req, res) => {
    try {
        const admin = await Admin.findById(req.user._id).select("-password");
        res.status(200).json(admin);
    } catch (error) {
        console.log("Error in admin getMe:", error.message);
        res.status(500).json({ error: "Internal Server error" });
    }
};

// ---- HOSPITAL MANAGEMENT ----

export const getAllHospitals = async (req, res) => {
    try {
        const hospitals = await Hospital.find().select("-password");
        res.status(200).json(hospitals);
    } catch (error) {
        console.log("Error in getAllHospitals:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

export const approveHospital = async (req, res) => {
    try {
        const hospital = await Hospital.findByIdAndUpdate(
            req.params.id,
            { approved: true },
            { new: true }
        ).select("-password");

        if (!hospital) {
            return res.status(404).json({ error: "Hospital not found" });
        }
        res.status(200).json({ message: "Hospital approved", hospital });
    } catch (error) {
        console.log("Error in approveHospital:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

export const removeHospital = async (req, res) => {
    try {
        const hospital = await Hospital.findByIdAndDelete(req.params.id);
        if (!hospital) {
            return res.status(404).json({ error: "Hospital not found" });
        }
        res.status(200).json({ message: "Hospital removed" });
    } catch (error) {
        console.log("Error in removeHospital:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

// ---- DONOR MANAGEMENT ----

export const getAllDonors = async (req, res) => {
    try {
        const donors = await Donor.find().select("-password");
        res.status(200).json(donors);
    } catch (error) {
        console.log("Error in getAllDonors:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

export const removeDonor = async (req, res) => {
    try {
        const donor = await Donor.findByIdAndDelete(req.params.id);
        if (!donor) {
            return res.status(404).json({ error: "Donor not found" });
        }
        res.status(200).json({ message: "Donor removed" });
    } catch (error) {
        console.log("Error in removeDonor:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

// ---- BLOOD REQUESTS ----

export const getAllRequests = async (req, res) => {
    try {
        const requests = await BloodRequest.find()
            .populate("hospitalId", "name address")
            .populate("donorId", "name bloodType contact")
            .sort({ createdAt: -1 });
        res.status(200).json(requests);
    } catch (error) {
        console.log("Error in getAllRequests:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

// ---- REPORTS ----

export const getReports = async (req, res) => {
    try {
        const totalDonors = await Donor.countDocuments();
        const activeDonors = await Donor.countDocuments({ active: true });
        const totalHospitals = await Hospital.countDocuments();
        const approvedHospitals = await Hospital.countDocuments({ approved: true });
        const totalRequests = await BloodRequest.countDocuments();
        const pendingRequests = await BloodRequest.countDocuments({ status: "Pending" });
        const acceptedRequests = await BloodRequest.countDocuments({ status: "Accepted" });
        const completedDonations = await BloodRequest.countDocuments({ status: "Completed" });

        res.status(200).json({
            totalDonors,
            activeDonors,
            totalHospitals,
            approvedHospitals,
            totalRequests,
            pendingRequests,
            acceptedRequests,
            completedDonations
        });
    } catch (error) {
        console.log("Error in getReports:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

// ---- POSTS (Announcements) ----

export const createPost = async (req, res) => {
    try {
        const { title, content, image } = req.body;

        let imageUrl = "";
        if (image) {
            const uploaded = await cloudinary.uploader.upload(image, {
                folder: "blood-posts",
            });
            imageUrl = uploaded.secure_url;
        }

        const post = new Post({
            title,
            content,
            image: imageUrl,
            adminId: req.user._id
        });
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        console.log("Error in createPost:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Delete image from cloudinary if exists
        if (post.image) {
            const publicId = post.image.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(`blood-posts/${publicId}`);
        }

        res.status(200).json({ message: "Post deleted" });
    } catch (error) {
        console.log("Error in deletePost:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};
