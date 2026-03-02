const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  subject: String,
  message: { type: String, required: true },

  status: {
    type: String,
    enum: ["Unread", "Read", "Resolved"],
    default: "Unread"
  }

}, { timestamps: true });

module.exports = mongoose.model("Contact", contactSchema);