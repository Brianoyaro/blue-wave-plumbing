const Item = require("../models/Item");
const cloudinary = require("cloudinary").v2;

// ------------------ GET ALL (Grouped by Category or Full Category View) ------------------
exports.getItems = async (req, res) => {
  try {
    const { search, category, limit = 6, all = false, page = 1 } = req.query;
    const query = {};

    // Search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    const categories = await Item.distinct("category");

    // If category + all=true → return all items in that category
    if (category && all === "true") {
      const items = await Item.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
      const totalItems = await Item.countDocuments(query);

      return res.json({
        items,
        categories,
        pagination: {
          totalItems,
          totalPages: Math.ceil(totalItems / limit),
          currentPage: parseInt(page),
        },
      });
    }

    // Otherwise → return grouped items, each category limited
    let grouped = {};
    for (const c of categories) {
      const items = await Item.find({ ...query, category: c })
        .sort({ createdAt: -1 })
        .limit(parseInt(limit));
      if (items.length > 0) {
        grouped[c] = items;
      }
    }

    res.json({ grouped, categories });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch items", details: err.message });
  }
};

// ------------------ GET BY ID ------------------
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Error retrieving item", details: err.message });
  }
};

// ------------------ CREATE ------------------
exports.createItem = async (req, res) => {
  try {
    const { name, description, price, category, piecesAvailable } = req.body;
    if (!name || !category) {
      return res.status(400).json({ error: "Name and category are required" });
    }

    const imageUrls = req.files?.map(file => file.path) || [];
    const newItem = new Item({
      name,
      description,
      price,
      category,
      piecesAvailable,
      images: imageUrls,
    });

    await newItem.save();
    res.status(201).json({ message: "Item created successfully", item: newItem });
  } catch (err) {
    res.status(500).json({ error: "Failed to create item", details: err.message });
  }
};

// ------------------ UPDATE ------------------
exports.putItem = async (req, res) => {
  try {
    const { name, description, price, category, piecesAvailable } = req.body;
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    // Replace images if new files uploaded
    if (req.files?.length > 0) {
      for (const img of item.images) {
        try {
          await cloudinary.uploader.destroy(img.public_id);
        } catch (err) {
          console.warn("Cloudinary delete failed:", err.message);
        }
      }
      item.images = req.files.map(file => file.path);
    }

    item.name = name || item.name;
    item.description = description || item.description;
    item.price = price ?? item.price;
    item.category = category || item.category;
    item.piecesAvailable = piecesAvailable ?? item.piecesAvailable;

    await item.save();
    res.json({ message: "Item updated successfully", item });
  } catch (err) {
    res.status(500).json({ error: "Failed to update item", details: err.message });
  }
};

// ------------------ DELETE ------------------
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    for (const img of item.images) {
      try {
        await cloudinary.uploader.destroy(img.public_id);
      } catch (err) {
        console.warn("Cloudinary delete failed:", err.message);
      }
    }

    await item.deleteOne();
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete item", details: err.message });
  }
};

