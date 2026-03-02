const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, enum: ["Makkah", "Madina"] },
  distanceFromHaram: Number,
  category: { type: String, enum: ["3 Star", "4 Star", "5 Star"] }
}, { timestamps: true });

module.exports = mongoose.model("Hotel", hotelSchema);