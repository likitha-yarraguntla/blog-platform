
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Blog = require("../models/Blog");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

console.log("AUTH ROUTES LOADED");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, profileImage } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profileImage: profileImage || "",
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User Registered Successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User Not Found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login Success",
      token,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// PROFILE
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password");

    const blogsCount = await Blog.countDocuments({
      author: req.user.id,
    });

    res.status(200).json({
      success: true,
      user,
      blogsCount,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// UPDATE PROFILE
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const { username, profileImage } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    user.username = username || user.username;
    user.profileImage =
      profileImage || user.profileImage;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      user,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});


module.exports = router;
