import { errorHandler } from "./../utils/error.js";
import Blog from "../models/blogModal.js";

export const uploadBlog = async (req, res, next) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json({
      success: true,
      blog,
    });
  } catch (error) {
    next(error);
  }
};

export const showBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return next(new errorHandler("Blog not found", 404));
    }
    res.status(200).json(blog);
  } catch (error) {
    next(error);
  }
};

export const showAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    next(error);
  }
};
