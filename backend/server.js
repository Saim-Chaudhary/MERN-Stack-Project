const dotenv = require("dotenv");
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

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        next(error);
    }
});

// Test route
app.get("/", (req, res) => {
    res.send("API is running...");
});

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