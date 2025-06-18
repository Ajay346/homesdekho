import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    reraName: {
      type: String,
      required: true,
    },
    reraimageURLS: {
      type: Array,
      required: true,
    },
    priceRange: {
      type: Array,
      required: true,
    },
    BHK: {
      type: Array,
      required: true,
    },
    sqftMin: {
      type: Array,
      required: true,
    },
    sqftMax: {
      type: Array,
      required: true,
    },
    amenities: {
      type: Array,
      required: true,
    },
    possessiondate: {
      type: String,
      required: true,
    },
    devlopername: {
      type: String,
      required: true,
    },
    aboutdevloper: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    subregion: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    discountedDeal: {
      type: Boolean,
      required: true,
    },
    displayOrder: {
      type: Boolean,
    },
    userRef: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
