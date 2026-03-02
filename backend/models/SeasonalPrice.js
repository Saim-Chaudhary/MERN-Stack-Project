const mongoose = require("mongoose");

const seasonalPriceSchema = new mongoose.Schema({
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Package"
  },
  seasonName: String,
  price: Number,
  startDate: Date,
  endDate: Date
}, { timestamps: true });

module.exports = mongoose.model("SeasonalPrice", seasonalPriceSchema);