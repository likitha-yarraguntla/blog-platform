
const express = require("express");
const Blog = require("../models/Blog");
const verifyToken = require("../middleware/authMiddleware");

console.log("BLOG ROUTES LOADED");

const router = express.Router();

// TEST ROUTE
router.get("/test", (req, res) => {
  res.send("Blog routes working");
});

// CREATE BLOG
router.post("/create", verifyToken, async (req, res) => {
  try {
    const { title, content, image } = req.body;

    const blog = new Blog({
      title,
      content,
      image: image || "",
      author: req.user.id,
    });

    await blog.save();

    res.status(201).json({
      success: true,
      message: "Blog Created Successfully",
      blog,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// GET MY BLOGS
router.get("/my-blogs", verifyToken, async (req, res) => {
  try {
    const blogs = await Blog.find({
      author: req.user.id,
    })
      .populate("author", "username email profileImage")
      .populate("comments.user", "username")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// LIKE / UNLIKE BLOG
router.put("/like/:id", verifyToken, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog Not Found",
      });
    }

    const alreadyLiked = blog.likes.includes(req.user.id);

    if (alreadyLiked) {
      blog.likes = blog.likes.filter(
        (id) => id.toString() !== req.user.id
      );
    } else {
      blog.likes.push(req.user.id);
    }

    await blog.save();

    res.status(200).json({
      success: true,
      likesCount: blog.likes.length,
      liked: !alreadyLiked,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// ADD COMMENT
router.post("/comment/:id", verifyToken, async (req, res) => {
  try {
    const { text } = req.body;

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog Not Found",
      });
    }

    blog.comments.push({
      text,
      user: req.user.id,
    });

    await blog.save();

    const updatedBlog = await Blog.findById(req.params.id)
      .populate("comments.user", "username");

    res.status(200).json({
      success: true,
      comments: updatedBlog.comments,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// GET ALL BLOGS + SEARCH + PAGINATION
router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 5;
    const search = req.query.search || "";

    const query = {
      title: {
        $regex: search,
        $options: "i",
      },
    };

    const totalBlogs = await Blog.countDocuments(query);

    const blogs = await Blog.find(query)
      .populate("author", "username email profileImage")
      .populate("comments.user", "username")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      blogs,
      currentPage: page,
      totalPages: Math.ceil(totalBlogs / limit),
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// UPDATE BLOG
router.put("/update/:id", verifyToken, async (req, res) => {
  try {
    const { title, content, image } = req.body;

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog Not Found",
      });
    }

    if (blog.author.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized",
      });
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.image = image || blog.image;

    await blog.save();

    res.status(200).json({
      success: true,
      message: "Blog Updated Successfully",
      blog,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// DELETE BLOG
router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog Not Found",
      });
    }

    if (blog.author.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized",
      });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Blog Deleted Successfully",
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
