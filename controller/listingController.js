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

// get property by slug name Mumbai

export const getListingBySlug = async (req, res, next) => {
  try {
    const slug = req.params.slugname;
    const property = await Listing.findOne({
      slug: slug,
      $or: [
        { location: "mumbai" },
        { location: "" },
        { location: { $exists: false } },
      ],
      propertytype: { $ne: "commercial" },
    });

    if (!property) {
      return next(errorHandler(404, "Property not found!"));
    }
    res.status(200).json(property);
  } catch (error) {
    next(error);
  }
};
// get commercial property by slug name Mumbai

export const getCommercialListingBySlug = async (req, res, next) => {
  try {
    const slug = req.params.slugname;
    const property = await Listing.findOne({
      slug: slug,
      propertytype: "commercial",
    });

    if (!property) {
      return next(errorHandler(404, "Property not found!"));
    }
    res.status(200).json(property);
  } catch (error) {
    next(error);
  }
};
// get property by slug name Pune
export const getListingPuneBySlug = async (req, res, next) => {
  try {
    const slug = req.params.slugname;
    const property = await Listing.findOne({
      slug: slug,
      $or: [{ location: "pune" }],
    });

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
          location: { $ne: "pune" }, // Exclude properties with location "pune"
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
    const property = await Listing.find({
      discountedDeal: true,
      $or: [{ location: "" }, { location: "mumbai" }],
    });
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
// get property by Subregion Area

export const getCommercialListingBySubregion = async (req, res, next) => {
  try {
    const subregionname = req.params.subregionname;
    const { skip = 0, limit = 10 } = req.query; // Default skip=0, limit=10

    const skipNumber = Number(skip);
    const limitNumber = Number(limit);

    const property = await Listing.find({
      subregion: { $regex: new RegExp(subregionname, "i") },
    })
      .where("propertytype")
      .equals("commercial")
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

// get propeties by area

export const getPropertyByArea = async (req, res, next) => {
  try {
    const area = req.params.area;
    const property = await Listing.find({ subregion: area });
    if (property.length === 0) {
      return next(errorHandler(404, "Property not found!"));
    }
    res.status(200).json(property);
  } catch (error) {
    next(error);
  }
};

export const getPropertyByDisplayOrder = async (req, res, next) => {
  try {
    const propertyIDs = req.body;
    const selectedArea = propertyIDs.selectedArea;
    const selectedProperties = propertyIDs.selectedProperties;
    if (propertyIDs.selectedProperties.length !== 3) {
      return next(errorHandler(400, "Please select exactly three properties."));
    }

    // Set displayOrder to false for all properties in the selected area
    await Listing.updateMany(
      { subregion: selectedArea },
      { displayOrder: false }
    );

    // Update displayOrder to true for selected properties
    await Listing.updateMany(
      { _id: { $in: selectedProperties } },
      { displayOrder: true }
    );

    res.status(200).json({ message: "Display order updated successfully." });
  } catch (error) {
    next(error);
  }
};

// get property by region name
export const getListinaygByRegionForDisplay = async (req, res, next) => {
  try {
    const region = req.params.region;
    const property = await Listing.find({ region: region, displayOrder: true });
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
export const getCommercialByRegionForDisplay = async (req, res, next) => {
  try {
    const region = req.params.region;
    const property = await Listing.find({
      region: region,
      // displayOrder: false,
      propertytype: "commercial",
    });
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
