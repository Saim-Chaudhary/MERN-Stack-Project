const mongoose = require("mongoose");

const documentTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  isRequired: { type: Boolean, default: false },
  expiryDurationMonths: Number,
  requirements: [String],
  validationRules: String
}, { timestamps: true });

module.exports = mongoose.model("DocumentType", documentTypeSchema);
