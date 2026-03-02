const mongoose = require("mongoose");

const expenseCategorySchema = new mongoose.Schema({
  name: String,
  description: String
}, { timestamps: true });

module.exports = mongoose.model("ExpenseCategory", expenseCategorySchema);