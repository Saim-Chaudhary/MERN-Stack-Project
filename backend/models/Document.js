const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  documentType: {
    type: String,
    enum: ["Passport", "Visa", "Ticket", "Vaccination", "Other"]
  },

  fileUrl: String,

  status: {
    type: String,
    enum: ["Pending", "Verified", "Rejected"],
    default: "Pending"
  }

}, { timestamps: true });

module.exports = mongoose.model("Document", documentSchema);