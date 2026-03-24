import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import dns from "dns";
import Admin from "../models/admin.model.js";

dns.setServers(["8.8.4.4", "8.8.8.8"]);
dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");

        const existingAdmin = await Admin.findOne({ email: "admin@blood.com" });
        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("admin123", salt);

        const admin = new Admin({
            name: "Blood Bank Admin",
            email: "admin@blood.com",
            password: hashedPassword
        });

        await admin.save();
        console.log("Admin created successfully");
        console.log("Email: admin@blood.com");
        console.log("Password: admin123");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding admin:", error.message);
        process.exit(1);
    }
};

seedAdmin();
