const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: "ExpenseCategory" },
  amount: Number,
  description: String,
  relatedBooking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
  expenseDate: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Expense", expenseSchema);