import express from "express";
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjectBySlug,
  getLegacyListings,
  getProjects,
  importLegacyListing,
  updateProject,
} from "../controller/projectController.js";
// import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/", getProjects);
router.get("/legacy", getLegacyListings);
router.post("/import/:id", importLegacyListing);
router.get("/slug/:slug", getProjectBySlug);
router.get("/:id", getProjectById);
router.post("/", createProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
