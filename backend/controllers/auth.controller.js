import Donor from "../models/donor.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from '../lib/utils/generateToken.js';
import e from "express";

export const signup = async (req, res) => {
    try {
        const { name, age, contact, bloodType, address, active, email, password } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }
        const existingEmail = await Donor.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email already exists" });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }
        // hash the password before saving to the database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newDonor = new Donor({
            name,
            age,
            contact,
            bloodType,
            address,
            active,
            email,
            password: hashedPassword
        })
        if (newDonor) {
            generateTokenAndSetCookie(newDonor._id, res);
            await newDonor.save();
            res.status(201).json({
                _id: newDonor._id, 
                name: newDonor.name,
                age: newDonor.age,
                contact: newDonor.contact,
                bloodType: newDonor.bloodType,
                address: newDonor.address,
                active: newDonor.active, 
                email: newDonor.email
            });
        }
        else {
            res.status(400).json({ error: "Invalid donor data" });
        }
        
    } catch (error) {
        console.log("Error in signup controller:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

export const login = async (req, res) => {
    try {
        
        const { email, password } = req.body;
        const donor = await Donor.findOne({ email });
        const isPasswordCorrect =  await bcrypt.compare(password, donor?.password || "");
        if (!donor|| !isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        generateTokenAndSetCookie(donor._id, res);
        res.status(200).json({
            _id: donor._id, 
            name: donor.name,
            age: donor.age,
            contact: donor.contact,
            bloodType: donor.bloodType,
            address: donor.address,
            active: donor.active, 
            email: donor.email
        });

    } catch (error) {
        console.log("Error in login controller:", error.message);
        res.status(500).json({ error: "Internal Server error" });
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller:", error.message);
        res.status(500).json({ error: "Internal Server error" });
    }
};

export const getMe = async (req, res) => {
    try {
        const donor = await Donor.findById(req.donor._id).select("-password");
        res.status(200).json(donor);
        
    } catch (error) {
        console.log("Error in getCurrentUser controller:", error.message);
        res.status(500).json({ error: "Internal Server error" });
    }
}; // to authenticate the user and return their details based on the JWT token provided in the request cookies.
