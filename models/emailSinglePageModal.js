import mongoose from "mongoose";
const emailSinglePageSchema = new mongoose.Schema(
  {
    email: String,
    subject: String,
    projectName: String,
    name: String,
    mobile: String,
    status: String,
    followUp: String,
    followUps: [
      {
        note: { type: String, required: true, trim: true },
        createdAt: { type: Date, default: Date.now },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    date: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const SEOLeads = mongoose.model("SEOLeads", emailSinglePageSchema);

export default SEOLeads;
