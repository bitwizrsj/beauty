import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDatabase from "./config/database.js";
import errorHandler from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import cron from "node-cron";      // ✅ Import node-cron
import fetch from "node-fetch";     // ✅ Node 18+ has global fetch, else install node-fetch

// ✅ Load environment variables FIRST
dotenv.config();

// ✅ Sanity check for critical env vars
if (!process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET) {
  console.error("❌ Missing Cloudinary environment variables in .env file");
  process.exit(1); // Stop server immediately
}

const app = express();

// ✅ Connect to MongoDB
connectDatabase();

// ✅ Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://beauty-eight-tau.vercel.app"
];

// ✅ Configure CORS
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("❌ Not allowed by CORS"));
    }
  },
  credentials: true // if you want to send cookies/JWT
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Debug ENV values (don’t log secrets)
console.log("🔍 ENV Loaded:", {
  NODE_ENV: process.env.NODE_ENV || "not set",
  PORT: process.env.PORT || "not set",
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? "✅ Loaded" : "❌ Missing",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? "✅ Loaded" : "❌ Missing"
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "E-commerce API is running 🚀"
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});


// ------------------------
// ✅ Keep Render server alive
// ------------------------
const pingUrl = process.env.PING_URL || "https://beauty-4x8a.onrender.com"; // Replace with your Render URL

// Schedule cron job: every 10 minutes
cron.schedule("*/10 * * * *", async () => {
  try {
    const res = await fetch(pingUrl);
    console.log(`⏱️ Pinged server at ${new Date().toLocaleTimeString()} - Status: ${res.status}`);
  } catch (err) {
    console.error("❌ Ping failed:", err.message);
  }
});
