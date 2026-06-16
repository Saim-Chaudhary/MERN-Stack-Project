const Asset = require("../models/Asset");
const cloudinary = require("../config/cloudinary");

// Get all assets
const getAllAssets = async (req, res) => {
  try {
    const assets = await Asset.find().sort({ createdAt: -1 });
    return res.status(200).json({
      message: "Assets fetched successfully",
      data: assets
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching assets",
      error: error.message
    });
  }
};

// Get assets by type
const getAssetsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const assets = await Asset.find({ assetType: type, isActive: true });
    return res.status(200).json({
      message: "Assets fetched successfully",
      data: assets
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching assets",
      error: error.message
    });
  }
};

// Upload a new asset
const uploadAsset = async (req, res) => {
  try {
    const { name, description, assetType, altText } = req.body;

    if (!name || !assetType || !req.file) {
      return res.status(400).json({
        message: "Please provide name, assetType, and file"
      });
    }

    let imageUrl = '';
    let cloudinaryPublicId = '';

    if (req.file) {
      imageUrl = req.file.path || req.file.secure_url || req.file.url || '';
      cloudinaryPublicId = req.file.public_id || req.file.filename || '';
    }

    const newAsset = await Asset.create({
      name,
      description: description || "",
      assetType,
      imageUrl,
      cloudinaryPublicId,
      altText: altText || name
    });

    return res.status(201).json({
      message: "Asset uploaded successfully",
      data: newAsset
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error uploading asset",
      error: error.message
    });
  }
};

// Update asset details
const updateAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, altText, isActive } = req.body;

    const asset = await Asset.findById(id);
    if (!asset) {
      return res.status(404).json({
        message: "Asset not found"
      });
    }

    if (name) asset.name = name;
    if (description !== undefined) asset.description = description;
    if (altText) asset.altText = altText;
    if (isActive !== undefined) asset.isActive = isActive;

    await asset.save();

    return res.status(200).json({
      message: "Asset updated successfully",
      data: asset
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating asset",
      error: error.message
    });
  }
};

// Delete asset
const deleteAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const asset = await Asset.findById(id);

    if (!asset) {
      return res.status(404).json({
        message: "Asset not found"
      });
    }

    // Delete from Cloudinary if public_id exists
    if (asset.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(asset.cloudinaryPublicId);
      } catch (cloudinaryError) {
        console.error("Error deleting from Cloudinary:", cloudinaryError);
        // Continue with database deletion even if Cloudinary delete fails
      }
    }

    await Asset.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Asset deleted successfully",
      data: asset
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting asset",
      error: error.message
    });
  }
};

// Get single asset by ID
const getAssetById = async (req, res) => {
  try {
    const { id } = req.params;
    const asset = await Asset.findById(id);

    if (!asset) {
      return res.status(404).json({
        message: "Asset not found"
      });
    }

    return res.status(200).json({
      message: "Asset fetched successfully",
      data: asset
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching asset",
      error: error.message
    });
  }
};

module.exports = {
  getAllAssets,
  getAssetsByType,
  uploadAsset,
  updateAsset,
  deleteAsset,
  getAssetById
};
