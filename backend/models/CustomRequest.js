const mongoose = require("mongoose");

const customRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  preferredAirline: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Airline"
  },

  hotelType: { type: String, enum: ["3 Star", "4 Star", "5 Star"] },

  hotelName: { type: String, trim: true },

  transportType: { type: String, enum: ["Sharing", "Private", "VIP"] },

  duration: Number,

  numberOfAdults: Number,
  numberOfChildren: Number,
  numberOfInfants: Number,

  specialRequests: String,

  offeredPrice: Number,

  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending"
  }

}, { timestamps: true });

module.exports = mongoose.model("CustomRequest", customRequestSchema);