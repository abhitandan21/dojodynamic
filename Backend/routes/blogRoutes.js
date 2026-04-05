import express from "express";
import Blog from "../model/Blog.js";

const router = express.Router();

// ✅ Admin create blog
router.post("/", async (req, res) => {
  const blog = new Blog(req.body);
  await blog.save();
  res.json(blog);
});

// ✅ All blogs (students read)
router.get("/", async (req, res) => {
  const blogs = await Blog.find().sort({ date: -1 });
  res.json(blogs);
});

// ✅ Single blog
router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  res.json(blog);
});



// GET all blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
