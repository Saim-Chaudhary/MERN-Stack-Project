const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  assetType: {
    type: String,
    enum: ["hero", "login", "signup", "about", "package", "profile", "logo", "other"],
    required: true
  },
  imageUrl: { type: String, required: true },
  cloudinaryPublicId: { type: String, default: "" },
  altText: { type: String, default: "" },
  isActive: { type: Boolean, default: true },
  usageCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Asset", assetSchema);
