const express = require("express");
const assetController = require("../controllers/assetController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../config/multer");

const router = express.Router();

// Get all assets (public)
router.get("/", assetController.getAllAssets);

// Get assets by type (public)
router.get("/type/:type", assetController.getAssetsByType);

// Get single asset by ID (public)
router.get("/:id", assetController.getAssetById);

// Upload new asset (admin only)
router.post("/", authMiddleware, adminMiddleware, upload.single("file"), assetController.uploadAsset);

// Update asset details (admin only)
router.put("/:id", authMiddleware, adminMiddleware, assetController.updateAsset);

// Delete asset (admin only)
router.delete("/:id", authMiddleware, adminMiddleware, assetController.deleteAsset);

module.exports = router;
