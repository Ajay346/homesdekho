import express from "express";
import {
  fecthLeads,
  updateFollowUp,
} from "../controller/allLeadsController.js";

const router = express.Router();

router.post("/leads", fecthLeads);
router.post("/updatefollowup", updateFollowUp);

export default router;
