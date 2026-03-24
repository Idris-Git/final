import Hospital from "../models/hospital.model.js";
import Donor from "../models/donor.model.js";
import BloodRequest from "../models/bloodR.modle.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";

// ---- AUTH ----

export const signup = async (req, res) => {
    try {
        const { name, address, contact, email, password } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }
        const existingEmail = await Hospital.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email already exists" });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newHospital = new Hospital({
            name,
            address,
            contact,
            email,
            password: hashedPassword
        });

        if (newHospital) {
            await newHospital.save();
            generateTokenAndSetCookie(newHospital._id, "hospital", res);
            res.status(201).json({
                _id: newHospital._id,
                name: newHospital.name,
                address: newHospital.address,
                contact: newHospital.contact,
                email: newHospital.email,
                approved: newHospital.approved,
                message: "Hospital registered. Waiting for admin approval."
            });
        } else {
            res.status(400).json({ error: "Invalid hospital data" });
        }
    } catch (error) {
        console.log("Error in hospital signup:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const hospital = await Hospital.findOne({ email });
        const isPasswordCorrect = await bcrypt.compare(password, hospital?.password || "");
        if (!hospital || !isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        generateTokenAndSetCookie(hospital._id, "hospital", res);
        res.status(200).json({
            _id: hospital._id,
            name: hospital.name,
            address: hospital.address,
            contact: hospital.contact,
            email: hospital.email,
            approved: hospital.approved
        });
    } catch (error) {
        console.log("Error in hospital login:", error.message);
        res.status(500).json({ error: "Internal Server error" });
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in hospital logout:", error.message);
        res.status(500).json({ error: "Internal Server error" });
    }
};

export const getMe = async (req, res) => {
    try {
        const hospital = await Hospital.findById(req.user._id).select("-password");
        res.status(200).json(hospital);
    } catch (error) {
        console.log("Error in hospital getMe:", error.message);
        res.status(500).json({ error: "Internal Server error" });
    }
};

// ---- BLOOD REQUESTS ----

export const createBloodRequest = async (req, res) => {
    try {
        if (!req.user.approved) {
            return res.status(403).json({ error: "Hospital not approved by admin yet" });
        }

        const { patientName, patientAge, bloodType, emergencyLevel, requiredUnits } = req.body;

        const newRequest = new BloodRequest({
            patientName,
            patientAge,
            bloodType,
            emergencyLevel,
            requiredUnits,
            hospitalAddress: req.user.address,
            hospitalId: req.user._id
        });

        await newRequest.save();
        res.status(201).json(newRequest);
    } catch (error) {
        console.log("Error in createBloodRequest:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

export const getHospitalRequests = async (req, res) => {
    try {
        const requests = await BloodRequest.find({ hospitalId: req.user._id })
            .populate("donorId", "name bloodType contact address")
            .sort({ createdAt: -1 });
        res.status(200).json(requests);
    } catch (error) {
        console.log("Error in getHospitalRequests:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

export const completeRequest = async (req, res) => {
    try {
        const request = await BloodRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ error: "Request not found" });
        }
        if (request.hospitalId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Not authorized" });
        }
        if (request.status !== "Accepted") {
            return res.status(400).json({ error: "Request must be accepted before completing" });
        }

        request.status = "Completed";
        await request.save();

        // Update donor's last donation date
        if (request.donorId) {
            await Donor.findByIdAndUpdate(request.donorId, { lastDonationDate: new Date() });
        }

        res.status(200).json(request);
    } catch (error) {
        console.log("Error in completeRequest:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

// ---- SEARCH DONORS ----

export const searchDonors = async (req, res) => {
    try {
        if (!req.user.approved) {
            return res.status(403).json({ error: "Hospital not approved by admin yet" });
        }

        const { bloodType, address } = req.query;
        const filter = { active: true };

        if (bloodType) filter.bloodType = bloodType;
        if (address) filter.address = { $regex: address, $options: "i" };

        const donors = await Donor.find(filter).select("-password");
        res.status(200).json(donors);
    } catch (error) {
        console.log("Error in searchDonors:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};
