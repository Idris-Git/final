import Donor from "../models/donor.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from '../lib/utils/generateToken.js';

export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }
        const existingEmail = await Donor.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email already exists" });
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
    res.json({ data: "you hit the login endpoint" });
};

export const logout = async (req, res) => {
    res.json({ data: "you hit the logout endpoint" });
};
