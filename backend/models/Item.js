const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, default: 0 },
  category: { type: String, required: true }, // new field
  piecesAvailable: { type: Number, default: 0 }, // new field
  images: [String], // Array of image URLs
}, { timestamps: true });

module.exports = mongoose.model("Item", itemSchema);

