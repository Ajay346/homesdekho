import express from "express";

import {
  getAllDeveloperPlots,
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
router.get("/plotdevloper/:devname", getAllDeveloperPlots);

export default router;
