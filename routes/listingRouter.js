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
} from "../controller/listingController.js";

const router = express.Router();

router.post("/create", createListing);
router.delete("/delete/:id", deleteListing);
router.post("/update/:id", updateListing);
router.get("/get/:id", getListing);
router.get("/propertyname/:slugname", getListingBySlug);
router.post("/search", getSearchProperty);
router.get("/propertydevloper/:devname", getListingByDevName);
router.get("/propertysubregion/:subregionname", getListingBySubregion);
router.get("/regionproperty/:region", getListingByRegion);
router.get("/discountedproperty", getListingByDiscount);

export default router;
