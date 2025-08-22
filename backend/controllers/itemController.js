
// controllers/itemController.js
const Item = require("../models/Item");

exports.getItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createItem = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const imageUrls = req.files.map(file => file.path);

    const newItem = new Item({
      name,
      description,
      price,
      images: imageUrls,
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update item (with optional new images, max 10 total)
exports.putItem = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    // Delete old images from Cloudinary if new ones are uploaded
    if (req.files.length > 0) {
      for (const img of item.images) {
        await cloudinary.uploader.destroy(img.public_id);
      }
      item.images = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }));
    }

    item.name = name || item.name;
    item.description = description || item.description;
    item.price = price || item.price;

    await item.save();
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update item" });
  }
};

// Delete item
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    // Delete images from Cloudinary
    for (const img of item.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    await item.deleteOne();
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete item" });
  }
};
