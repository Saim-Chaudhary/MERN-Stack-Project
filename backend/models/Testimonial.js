const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },

  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true },

  isApproved: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false }

}, { timestamps: true });

module.exports = mongoose.model("Testimonial", testimonialSchema);