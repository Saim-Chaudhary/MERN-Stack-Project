const mongoose = require("mongoose");

const airlineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactNumber: String,
  contractDetails: String,
  status: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Airline", airlineSchema);