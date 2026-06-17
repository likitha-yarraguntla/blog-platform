const express = require("express");
console.log("SERVER FILE RUNNING");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

app.get("/", (req, res) => {
  res.send("Blog API Running");
});

app.listen(5000, () => {
  console.log("Server Running");
});