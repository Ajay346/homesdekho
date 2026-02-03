import mongoose from "mongoose";
const seoSchema = new mongoose.Schema(
  {
    metatitle: String,
    metadescription: String,
    propertyid: String,
  },
  { timestamps: true },
);

const Seo = mongoose.model("Seo", seoSchema);

export default Seo;
