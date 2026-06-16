const mongoose = require("mongoose");
const paymentSchema = new mongoose.Schema({

  booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  paymentMethod: String,
  transactionId: String,
  paymentType: {
    type: String,
    enum: ["Full", "Deposit", "Remaining"],
    default: "Full"
  },
  stripeSessionId: String,
  paymentStatus: {
    type: String,
    enum: ["Pending", "Completed", "Failed"],
    default: "Pending"
  }
}, { timestamps: true });


module.exports = mongoose.model("Payment", paymentSchema);