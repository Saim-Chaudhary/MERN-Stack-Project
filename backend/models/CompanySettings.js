const mongoose = require("mongoose");

const companySettingsSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  companyEmail: { type: String, required: true },
  companyPhone: { type: String, required: true },
  companyAddress: { type: String, required: true },
  companyDescription: { type: String, default: "" },
  businessHours: { type: String, default: "Mon - Sat: 8:00 AM - 6:00 PM" },
  
  // Social Media Links
  facebookUrl: { type: String, default: "" },
  instagramUrl: { type: String, default: "" },
  twitterUrl: { type: String, default: "" },
  linkedinUrl: { type: String, default: "" },
  
  // Company Logo
  logoUrl: { type: String, default: "" },
  
  // Additional Info
  yearsExperience: { type: Number, default: 0 },
  happyPilgrims: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("CompanySettings", companySettingsSchema);
