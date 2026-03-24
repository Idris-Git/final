import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import connectMongoDB  from "./db/connectMongoDB.js";
import dns from "dns";
import cookieParser from "cookie-parser";
dns.setServers(["8.8.4.4", "8.8.8.8"]);


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // Middleware to parse req.body
app.use(express.urlencoded({ extended: true })); // Middleware to parse form data (urlencoded)

app.use(cookieParser()); // Middleware to parse cookies

app.use("/api/auth", authRoutes); 

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectMongoDB();
});
