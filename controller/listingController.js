import slugify from "slugify";
import Listing from "../models/listingModel.js";
import { errorHandler } from "./../utils/error.js";

// Create Property controller

export const createListing = async (req, res, next) => {
  try {
    const slug = slugify(req.body.name);

    const listing = await Listing.create({ ...req.body, slug });

    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

// Delete Propertiy

export const deleteListing = async (req, res, next) => {
  // console.log(req.params.id);
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "Property Not Found!"));
  }

  if (req.body.id === listing.userRef.toString()) {
    return next(errorHandler(401, "You can only delete your own properties!"));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Property has been deleted.");
  } catch (error) {
    next(error);
  }
};

// Update Porperty

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(401, "Property not found!"));
  }

  try {
    const updatedProperty = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedProperty);
  } catch (error) {
    next(error);
  }
};

// get single property by id

export const getListing = async (req, res, next) => {
  try {
    const property = await Listing.findById(req.params.id);
    // console.log(req.params.id);

    if (!property) {
      return next(errorHandler(404, "Property not found!"));
    }
    res.status(200).json(property);
  } catch (error) {
    next(error);
  }
};

// get property by slug name

export const getListingBySlug = async (req, res, next) => {
  try {
    const slug = req.params.slugname;
    const property = await Listing.findOne({ slug });

    if (!property) {
      return next(errorHandler(404, "Property not found!"));
    }
    res.status(200).json(property);
  } catch (error) {
    next(error);
  }
};

// get search property

export const getSearchProperty = async (req, res, next) => {
  try {
    const searchProperties = await Listing.aggregate([
      {
        $match: {
          $or: [
            { name: { $regex: req.body.name, $options: "i" } },
            { address: { $regex: req.body.name, $options: "i" } },
            { devlopername: { $regex: req.body.name, $options: "i" } },
          ],
        },
      },
      {
        $group: {
          _id: {
            name: "$name",
            address: "$address",
            devlopername: "$devlopername",
          }, // Group by name, address, and devlopername to ensure uniqueness
          doc: { $first: "$$ROOT" }, // Keep the first document for each unique group
        },
      },
      {
        $replaceRoot: { newRoot: "$doc" }, // Flatten the structure
      },
      {
        $addFields: {
          matchedField: {
            $cond: {
              if: {
                $regexMatch: {
                  input: "$name",
                  regex: req.body.name,
                  options: "i",
                },
              },
              then: "name",
              else: {
                $cond: {
                  if: {
                    $regexMatch: {
                      input: "$address",
                      regex: req.body.name,
                      options: "i",
                    },
                  },
                  then: "address",
                  else: "devlopername",
                },
              },
            },
          },
        },
      },
      {
        $limit: 10, // Limit to 10 unique results
      },
    ]);

    res.status(200).json(searchProperties);
  } catch (error) {
    next(error);
  }
};

// get property by devloper name

export const getListingByDevName = async (req, res, next) => {
  try {
    const devName = req.params.devname;
    const { skip = 0, limit = 10 } = req.query; // Default skip=0, limit=10

    const skipNumber = Number(skip);
    const limitNumber = Number(limit);

    const property = await Listing.find({
      devlopername: { $regex: new RegExp(devName, "i") },
    })
      .skip(skipNumber) // Skip documents for pagination
      .limit(limitNumber) // Limit the number of documents
      .exec();

    const total = await Listing.countDocuments({
      devlopername: { $regex: new RegExp(devName, "i") },
    });

    if (!property) {
      return next(errorHandler(404, "Property not found!"));
    }

    res.status(200).json(property);
  } catch (error) {
    next(error);
  }
};

// get property by region name
export const getListingByRegion = async (req, res, next) => {
  try {
    const region = req.params.region;
    const property = await Listing.find({ region: region });
    if (property.length === 0) {
      return next(errorHandler(404, "Property not found!"));
    }

    const groupedProperties = property.reduce((acc, item) => {
      const subregion = item.subregion;
      if (!acc[subregion]) {
        acc[subregion] = [];
      }
      acc[subregion].push(item);
      return acc;
    }, {});

    res.status(200).json(groupedProperties);
  } catch (error) {
    next(error);
  }
};

// Discounted Deal API

export const getListingByDiscount = async (req, res, next) => {
  try {
    const property = await Listing.find().where("discountedDeal").equals(true);
    if (property.length === 0) {
      return next(errorHandler(404, "Property not found!"));
    }

    res.status(200).json(property);
  } catch (error) {
    next(error);
  }
};

// get property by Subregion Area

export const getListingBySubregion = async (req, res, next) => {
  try {
    const subregionname = req.params.subregionname;
    const { skip = 0, limit = 10 } = req.query; // Default skip=0, limit=10

    const skipNumber = Number(skip);
    const limitNumber = Number(limit);

    const property = await Listing.find({
      subregion: { $regex: new RegExp(subregionname, "i") },
    })
      .skip(skipNumber) // Skip documents for pagination
      .limit(limitNumber) // Limit the number of documents
      .exec();

    const total = await Listing.countDocuments({
      subregion: { $regex: new RegExp(subregionname, "i") },
    });

    if (!property) {
      return next(errorHandler(404, "Property not found!"));
    }

    res.status(200).json(property);
  } catch (error) {
    next(error);
  }
};
