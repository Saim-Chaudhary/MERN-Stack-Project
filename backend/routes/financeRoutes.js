const express = require("express");
const financeController = require("../controllers/financeController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// Get finance statistics (admin only)
router.get("/stats", authMiddleware, adminMiddleware, financeController.getFinanceStats);

module.exports = router;
