import mongoose from "mongoose";
const emailSchema = new mongoose.Schema(
  {
    email: String,
    subject: String,
    name: String,
    mobile: String,
    status: String,
    followUp: String,
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Leads = mongoose.model("Leads", emailSchema);

export default Leads;
