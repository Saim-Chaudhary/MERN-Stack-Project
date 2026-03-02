const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  basePrice: { type: Number, required: true },
  duration: Number,

  airline: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Airline"
  },

  hotels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel"
  }],

  transportType: { type: String, enum: ["Sharing", "Private", "VIP"] },

  includedServices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service"
  }],

  departureDate: Date,
  returnDate: Date,

  cancellationPolicy: String,

  isActive: { type: Boolean, default: true }

}, { timestamps: true });

module.exports = mongoose.model("Package", packageSchema);