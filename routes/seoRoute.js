import express from "express";
import {
  fecthSeoProperties,
  updateseoproperty,
  getPropertyMetaInfo,
} from "../controller/seoController.js";

const router = express.Router(); // SEO related routes can be added here in the future

router.post("/seoproperty", fecthSeoProperties);
router.put("/updateseoproperty", updateseoproperty);
router.post("/propertymetainfo", getPropertyMetaInfo);

export default router;
