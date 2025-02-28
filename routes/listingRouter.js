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
router.get("/regionpropertyfordisplay/:region", getListinaygByRegionForDisplay);
router.get("/discountedproperty", getListingByDiscount);
router.get("/properties/:area", getPropertyByArea);
router.post("/displayorder", getPropertyByDisplayOrder);

export default router;
