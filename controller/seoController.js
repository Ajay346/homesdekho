import { errorHandler } from "./../utils/error.js";
import Listing from "../models/listingModel.js";
import Seo from "../models/seoModal.js";

export const fecthSeoProperties = async (req, res, next) => {
  try {
    const seoproperty = await Listing.findOne({ name: req.body.name });

    if (!seoproperty) {
      return next(errorHandler(404, "Property Not Found"));
    }
    res.status(200).json(seoproperty);
  } catch (error) {
    next(error);
  }
};

export const updateseoproperty = async (req, res, next) => {
  try {
    const { id, metaTitle, metaDescription } = req.body;
    // console.log("API HIT", id);

    // Try to find and update existing property
    let seoproperty = await Seo.findOneAndUpdate(
      { propertyid: id },
      {
        metatitle: metaTitle,
        metadescription: metaDescription,
        propertyid: id,
      },
      { new: true },
    );

    // If not found, create a new one
    if (!seoproperty) {
      seoproperty = await Seo.create({
        metatitle: metaTitle,
        metadescription: metaDescription,
        propertyid: id,
      });
    }

    res.status(200).json(seoproperty);
  } catch (error) {
    next(error);
  }
};

export const getPropertyMetaInfo = async (req, res, next) => {
  try {
    // console.log("Property ID Received:", req.body.propertyID);
    const seoInfo = await Seo.findOne({ propertyid: req.body.propertyID });

    if (!seoInfo) {
      res.status(200).json(null);
    } else {
      res.status(200).json(seoInfo);
    }
  } catch (error) {
    next(error);
  }
};
