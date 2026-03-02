const mongoose = require("mongoose");

const passengerSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true
  },
  fullName: { type: String, required: true },
  age: { type: Number, required: true },
  passengerType: {
    type: String,
    enum: ["Adult", "Child", "Infant"],
    required: true
  },
  passportNumber: String,
  nationality: String,
  gender: {
    type: String,
    enum: ["Male", "Female"]
  },
  specialRequirements: String
}, { timestamps: true });

module.exports = mongoose.model("Passenger", passengerSchema);
