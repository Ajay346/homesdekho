import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true },
  metatitle: String,
  metadescription: String,
  category: String,
  content: String,
  blogimage: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Blog", BlogSchema);
