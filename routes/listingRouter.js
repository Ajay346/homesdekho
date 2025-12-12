import express from "express";
import {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getListingBySlug,
  getListingByDevName,
  getSearchProperty,
  getListingByRegion,
  getListingByDiscount,
  getListingBySubregion,
  getPropertyByArea,
  getPropertyByDisplayOrder,
  getListinaygByRegionForDisplay,
  getCommercialByRegionForDisplay,
} from "../controller/listingController.js";

import {
  getSearchPropertyPune,
  getListingByDiscountPune,
} from "../controller/puneListingController.js";
import {
  createPlotListing,
  deletePLot,
  getPLots,
  updatePlot,
} from "../controller/plotController.js";

const router = express.Router();

router.post("/create", createListing);
router.post("/plotcreate", createPlotListing);
router.delete("/delete/:id", deleteListing);
router.delete("/deleteplot/:id", deletePLot);
router.post("/update/:id", updateListing);
router.post("/updateplot/:id", updatePlot);
router.get("/get/:id", getListing);
router.get("/getplots/:id", getPLots);
router.get("/propertyname/:slugname", getListingBySlug);
router.post("/search", getSearchProperty);
router.post("/punesearch", getSearchPropertyPune);
router.get("/propertydevloper/:devname", getListingByDevName);
router.get("/propertysubregion/:subregionname", getListingBySubregion);
router.get("/regionproperty/:region", getListingByRegion);
router.get("/regionpropertyfordisplay/:region", getListinaygByRegionForDisplay);
router.get(
  "/regioncommercialfordisplay/:region",
  getCommercialByRegionForDisplay
);
router.get("/discountedproperty", getListingByDiscount);
router.get("/punediscountedproperty", getListingByDiscountPune);
router.get("/properties/:area", getPropertyByArea);
router.post("/displayorder", getPropertyByDisplayOrder);

export default router;
