import Leads from "../models/emailModal.js";
import { errorHandler } from "./../utils/error.js";

export const fecthLeads = async (req, res, next) => {
  try {
    const leads = await Leads.find().sort({ createdAt: -1 });

    if (!leads) {
      return next(errorHandler(404, "Data Not Found"));
    }
    res.status(200).json(leads);
  } catch (error) {
    next(error);
  }
};

// Update Follow Up

export const updateFollowUp = async (req, res, next) => {
  try {
    // Ensure the ID is provided
    if (!req.body.id) {
      return res.status(400).json({ message: "ID parameter is required" });
    }
    const updatedProperty = await Leads.findByIdAndUpdate(
      req.body.id,
      req.body,
      { new: true } // Return the updated document
    );
    // If no document is found
    if (!updatedProperty) {
      return res.status(404).json({ message: "Data Not Found" });
    }

    res.status(200).json(updatedProperty);
  } catch (error) {
    next(error);
  }
};
