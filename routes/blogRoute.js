import express from "express";
import {
  showAllBlogs,
  showBlog,
  uploadBlog,
} from "../controller/blogController.js";

const router = express.Router();

router.post("/create", uploadBlog);
router.get("/singleblog/:slug", showBlog);
router.get("/allblog", showAllBlogs);

export default router;
