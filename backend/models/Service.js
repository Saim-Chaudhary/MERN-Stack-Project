const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: {
    type: String,
    enum: ["Accommodation", "Transport", "Meal", "Activity", "Guide", "Insurance", "Other"]
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Service", serviceSchema);
