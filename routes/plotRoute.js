import express from "express";

import {
  getAllPlotsLocation,
  getPlotsByArea,
  getPlotsByDiscount,
  getPlotsBySlug,
  getSearchPlot,
} from "../controller/plotController.js";

const router = express.Router();

router.post("/search", getSearchPlot);
router.get("/getplotsbyarea/:region", getPlotsByArea);
router.get("/plotname/:slugname", getPlotsBySlug);
router.get("/discountedproperty", getPlotsByDiscount);
router.get("/allplots/:subregionname", getAllPlotsLocation);

export default router;
