const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  package: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },

  numberOfAdults: Number,
  numberOfChildren: Number,
  numberOfInfants: Number,

  totalPrice: Number,

  assignedGuide: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Guide"
  },

  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Cancelled"],
    default: "Pending"
  },

  paymentStatus: {
    type: String,
    enum: ["Pending", "Partial", "Paid"],
    default: "Pending"
  }

}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);