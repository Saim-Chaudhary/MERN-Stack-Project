const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  package: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },

  travelDate: Date,
  notes: String,

  numberOfAdults: Number,
  numberOfChildren: Number,
  numberOfInfants: Number,

  totalPrice: Number,

  finalPrice: {
    type: Number,
    default: null
  },

  amountPaid: {
    type: Number,
    default: 0
  },

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