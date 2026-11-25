import express from "express";
import {
  fecthLeads,
  updateFollowUp,
} from "../controller/allLeadsController.js";
import {
  addProjectLeadFollowUp,
  getProjectLeads,
} from "../controller/projectLeadsController.js";
// import { verifyAdmin, verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/leads", fecthLeads);
router.post("/updatefollowup", updateFollowUp);
router.get("/project-leads", getProjectLeads);
router.post("/project-leads/:id/follow-ups", addProjectLeadFollowUp);

export default router;
