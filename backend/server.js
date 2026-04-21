require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const errorMiddleware = require("./middleware/errorMiddleware");

// Import all routes
const authRoutes = require("./routes/authRoutes");
const packageRoutes = require("./routes/packageRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const contactRoutes = require("./routes/contactRoutes");
const customRequestRoutes = require("./routes/customRequestRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const guideRoutes = require("./routes/guideRoutes");
const airlineRoutes = require("./routes/airlineRoutes");
const hotelRoutes = require("./routes/hotelRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const passengerRoutes = require("./routes/passengerRoutes");
const documentRoutes = require("./routes/documentRoutes");
const documentTypeRoutes = require("./routes/documentTypeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const expenseCategoryRoutes = require("./routes/expenseCategoryRoutes");
const seasonalPriceRoutes = require("./routes/seasonalPriceRoutes");

const app = express();

const defaultAllowedOrigins = [
  "http://localhost:3000",
  "https://mern-stack-project-three-vert.vercel.app"
];

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean)
  : defaultAllowedOrigins;

// Middlewares
app.use(express.json());
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, server-to-server, health checks)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

// Test route
app.get("/", (req, res) => {
    res.send("API is running...");
});

app.get("/api", (req, res) => {
    res.send("API is running...");
});

app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok" });
});

connectDB();
 

// All API routes
app.use("/api/auth", authRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/custom-requests", customRequestRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/guides", guideRoutes);
app.use("/api/airlines", airlineRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/passengers", passengerRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/document-types", documentTypeRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/expense-categories", expenseCategoryRoutes);
app.use("/api/seasonal-prices", seasonalPriceRoutes);

// Global error handler - must be at the very bottom after all routes
app.use(errorMiddleware);

// Export app
module.exports = app;

// Keep local development behavior unchanged
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}