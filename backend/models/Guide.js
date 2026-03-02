const mongoose = require("mongoose");

const guideSchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  email: String,
  experienceYears: Number,
  languages: [String],
  status: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Guide", guideSchema);