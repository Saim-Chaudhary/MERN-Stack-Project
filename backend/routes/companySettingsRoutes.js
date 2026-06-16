const express = require("express");
const companySettingsController = require("../controllers/companySettingsController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// Get company settings (public)
router.get("/", companySettingsController.getCompanySettings);

// Update company settings (admin only)
router.put("/", authMiddleware, adminMiddleware, companySettingsController.updateCompanySettings);

module.exports = router;
