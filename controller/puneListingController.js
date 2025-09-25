// import slugify from "slugify";
import Listing from "../models/listingModel.js";
// import { errorHandler } from "./../utils/error.js";

// get search property

export const getSearchPropertyPune = async (req, res, next) => {
  try {
    const searchTerm = req.body.name;
    const searchProperties = await Listing.aggregate([
      {
        $match: {
          $and: [
            { location: "pune" },
            {
              $or: [
                { name: { $regex: searchTerm, $options: "i" } },
                { address: { $regex: searchTerm, $options: "i" } },
                { devlopername: { $regex: searchTerm, $options: "i" } },
              ],
            },
          ],
        },
      },
      {
        $addFields: {
          matchedField: {
            $cond: [
              {
                $regexMatch: {
                  input: "$name",
                  regex: searchTerm,
                  options: "i",
                },
              },
              "name",
              {
                $cond: [
                  {
                    $regexMatch: {
                      input: "$address",
                      regex: searchTerm,
                      options: "i",
                    },
                  },
                  "address",
                  {
                    $cond: [
                      {
                        $regexMatch: {
                          input: "$devlopername",
                          regex: searchTerm,
                          options: "i",
                        },
                      },
                      "devlopername",
                      "unknown",
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
      {
        $group: {
          _id: {
            name: "$name",
            address: "$address",
            devlopername: "$devlopername",
          },
          doc: { $first: "$$ROOT" },
        },
      },
      { $replaceRoot: { newRoot: "$doc" } },
      { $limit: 10 },
    ]);
    res.status(200).json(searchProperties);
  } catch (err) {
    next(err);
  }
};

export const getListingByDiscountPune = async (req, res, next) => {
  try {
    const property = await Listing.find({
      discountedDeal: true,
      $or: [{ location: "pune" }],
    });
    if (property.length === 0) {
      return next(errorHandler(404, "Property not found!"));
    }

    res.status(200).json(property);
  } catch (error) {
    next(error);
  }
};
