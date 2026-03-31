import express from "express";
import dotenv from "dotenv";
import dns from "dns";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import hospitalRoutes from "./routes/hospital.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import donorRoutes from "./routes/donor.routes.js";
import postRoutes from "./routes/post.routes.js";
import connectMongoDB from "./db/connectMongoDB.js";
import path from "path";

dns.setServers(["8.8.4.4", "8.8.8.8"]);
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);           // Donor auth
app.use("/api/hospital", hospitalRoutes);   // Hospital auth + management
app.use("/api/admin", adminRoutes);         // Admin auth + management
app.use("/api/donor", donorRoutes);         // Donor functionality
app.use("/api/posts", postRoutes);          // Public posts

const distPath = path.join(__dirname, "frontend", "dist");
app.use(express.static(distPath));

// Catch-all: serve React app for non-API routes
app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectMongoDB();
});
