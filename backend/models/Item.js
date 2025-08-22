// models/Item.js
const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: Number,
  images: [String], // Array of image URLs
}, { timestamps: true });

module.exports = mongoose.model("Item", itemSchema);

