
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

console.log("SERVER FILE RUNNING");
console.log("MONGO_URI exists:", !!process.env.MONGO_URI);

const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");

console.log("AUTH ROUTES LOADED");
console.log("BLOG ROUTES LOADED");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Blog API Running");
});

const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`Server Running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:");
    console.error(err);
  });

// Optional MongoDB event listeners
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected successfully");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});
