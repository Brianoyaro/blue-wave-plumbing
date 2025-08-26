// routes/itemRoutes.js
const express = require("express");
const router = express.Router();
const { getItems, getItemById, createItem, putItem, deleteItem, getCategoryItems } = require("../controllers/itemController");
const upload = require("../utils/multerCloudinary");

// Routes
router.get("/", getItems);
router.get("/:id", getItemById);
router.post("/", upload.array("images", 10), createItem);
router.put('/:id', upload.array("images", 10), putItem);
router.delete('/:id', deleteItem);

module.exports = router;

