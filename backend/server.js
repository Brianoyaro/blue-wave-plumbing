// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const itemRoutes = require("./routes/itemRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint for keep-alive
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use("/api/items", itemRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  dbName: "blue_wave_plumbing",
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

