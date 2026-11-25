import mongoose from "mongoose";
import SEOLeads from "../models/emailSinglePageModal.js";

export const getProjectLeads = async (req, res, next) => {
  try {
    const leads = await SEOLeads.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json(leads);
  } catch (error) {
    return next(error);
  }
};

export const addProjectLeadFollowUp = async (req, res, next) => {
  const { id } = req.params;
  const note =
    typeof req.body?.note === "string" ? req.body.note.trim() : "";

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid lead ID." });
  }
  if (!note) {
    return res.status(400).json({ message: "Follow-up notes are required." });
  }
  if (note.length > 2000) {
    return res
      .status(400)
      .json({ message: "Follow-up notes must be 2000 characters or fewer." });
  }

  try {
    const lead = await SEOLeads.findOneAndUpdate(
      { _id: id, "followUps.2": { $exists: false } },
      {
        $push: {
          followUps: {
            note,
            createdAt: new Date(),
            ...(req.user?.id ? { createdBy: req.user.id } : {}),
          },
        },
      },
      { new: true, runValidators: true },
    );

    if (lead) {
      return res.status(201).json(lead);
    }

    const exists = await SEOLeads.exists({ _id: id });
    if (!exists) {
      return res.status(404).json({ message: "Lead not found." });
    }
    return res
      .status(409)
      .json({ message: "This lead already has three follow-ups." });
  } catch (error) {
    return next(error);
  }
};
