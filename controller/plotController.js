import slugify from "slugify";
import Plot from "../models/plotModal.js";
import { errorHandler } from "./../utils/error.js";

export const createPlotListing = async (req, res, next) => {
  try {
    const slug = slugify(req.body.name);

    const plot = await Plot.create({ ...req.body, slug });

    return res.status(201).json(plot);
  } catch (error) {
    next(error);
  }
};

export const getPLots = async (req, res, next) => {
  try {
    const property = await Plot.findById(req.params.id);
    // console.log(req.params.id);

    if (!property) {
      return next(errorHandler(404, "Property not found!"));
    }
    res.status(200).json(property);
  } catch (error) {
    next(error);
  }
};

export const updatePlot = async (req, res, next) => {
  const plot = await Plot.findById(req.params.id);

  if (!plot) {
    return next(errorHandler(401, "Plot not found!"));
  }

  try {
    const updatedPlot = await Plot.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json(updatedPlot);
  } catch (error) {
    next(error);
  }
};

export const deletePLot = async (req, res, next) => {
  const plot = await Plot.findById(req.params.id);
  if (!plot) {
    return next(errorHandler(404, "Property Not Found!"));
  }

  if (req.body.id === plot.userRef.toString()) {
    return next(errorHandler(401, "You can only delete your own properties!"));
  }

  try {
    await Plot.findByIdAndDelete(req.params.id);
    res.status(200).json("Property has been deleted.");
  } catch (error) {
    next(error);
  }
};

export const getAllPlots = async (req, res, next) => {
  try {
    let plots;
    if (req.params.id === "672873216d6bedd7141bf7a2") {
      // Fetch all properties
      plots = await Plot.find().sort({ createdAt: -1 });
    } else {
      // Fetch properties for the specific user
      plots = await Plot.find({ userRef: req.params.id }).sort({
        createdAt: -1,
      });
    }

    if (!plots || plots.length === 0) {
      res.status(202).json("No properties added by you.");
    } else {
      res.status(200).json(plots);
    }
  } catch (error) {
    next(error);
  }
};

// get search property

export const getSearchPlot = async (req, res, next) => {
  try {
    const plot = await Plot.find({
      name: { $regex: req.body.name, $options: "i" },
      location: req.body.location,
    });

    res.status(200).json(plot);
  } catch (error) {
    next(error);
  }
};

export const getPlotsByArea = async (req, res, next) => {
  try {
    const area = req.params.region;
    const property = await Plot.find({ region: area })
      .limit(3)
      .sort({ createdAt: -1 });
    if (property.length === 0) {
      return next(errorHandler(404, "Property not found!"));
    }
    res.status(200).json(property);
  } catch (error) {
    next(error);
  }
};

// get property by slug name

export const getPlotsBySlug = async (req, res, next) => {
  try {
    const slug = req.params.slugname;
    const property = await Plot.findOne({ slug });

    if (!property) {
      return next(errorHandler(404, "Property not found!"));
    }
    res.status(200).json(property);
  } catch (error) {
    next(error);
  }
};

// Discounted Deals
export const getPlotsByDiscount = async (req, res, next) => {
  try {
    const property = await Plot.find({
      discountedDeal: true,
    });
    if (property.length === 0) {
      return next(errorHandler(404, "Property not found!"));
    }

    res.status(200).json(property);
  } catch (error) {
    next(error);
  }
};
