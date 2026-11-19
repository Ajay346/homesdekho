import mongoose from "mongoose";
const emailSinglePageSchema = new mongoose.Schema(
  {
    email: String,
    subject: String,
    name: String,
    mobile: String,
    status: String,
    followUp: String,
    date: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const SEOLeads = mongoose.model("SEOLeads", emailSinglePageSchema);

export default SEOLeads;
