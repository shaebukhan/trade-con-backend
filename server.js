const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");

const app = express();

// Load environment variables
dotenv.config();

// Database connection
connectDB();

// CORS Middleware (with proper config)
app.use(cors({
    origin: 'https://dwfrontend-eight.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers

}));

// Middleware to parse URL-encoded and JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// HTTP request logger (Morgan)
app.use(morgan("dev"));

// Serving static files for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API routes
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.get("/testing", (req, res) => {
    res.send(" 1 2 3 & boom guys !");
});
// Auth routes
const authRoutes = require("./routes/authRoute");
app.use("/api/v1/auth", authRoutes);

// Review routes
const reviewRoutes = require("./routes/reviewRoute");
app.use("/api/v1/review", reviewRoutes);
//trades routes 
const tradeRoutes = require("./routes/tradeRoute");
app.use("/api/v1/trade", tradeRoutes);
//sub trades
const subtradeRoutes = require("./routes/subtradeRoute");
app.use("/api/v1/sub-trade", subtradeRoutes);

// Start server on specified port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`);
});
