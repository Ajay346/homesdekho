import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, trim: true },
    title: { type: String, trim: true, default: "" },
    alt: { type: String, trim: true, default: "" },
    order: { type: Number, default: 0 },
    layout: {
      type: String,
      enum: ["standard", "wide", "tall"],
      default: "standard",
    },
  },
  { _id: true },
);

const statisticSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true, default: "" },
    value: { type: String, trim: true, default: "" },
  },
  { _id: true },
);

const amenitySchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: "" },
    icon: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    order: { type: Number, default: 0 },
  },
  { _id: true },
);

const floorPlanSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: "" },
    image: { type: String, trim: true, default: "" },
    carpetArea: { type: String, trim: true, default: "" },
    builtUpArea: { type: String, trim: true, default: "" },
    price: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    order: { type: Number, default: 0 },
  },
  { _id: true },
);

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      maxlength: 140,
    },
    tagline: { type: String, trim: true, default: "" },
    location: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["Upcoming", "Under Construction", "Ready to Move"],
      default: "Upcoming",
    },
    possessionDate: { type: String, trim: true, default: "" },
    reraNumber: { type: String, trim: true, default: "" },
    developerName: { type: String, trim: true, default: "" },
    description: { type: String, default: "" },
    shortDescription: { type: String, default: "" },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    published: { type: Boolean, default: false },
    hero: {
      image: { type: String, trim: true, default: "" },
      heading: { type: String, trim: true, default: "" },
      description: { type: String, default: "" },
      projectName: { type: String, trim: true, default: "" },
      location: { type: String, trim: true, default: "" },
      configurations: [{ type: String, trim: true }],
      priceInfo: { type: String, trim: true, default: "" },
      ctaText: { type: String, trim: true, default: "Enquire Now" },
      enquirySettings: { type: String, trim: true, default: "" },
    },
    statistics: [statisticSchema],
    about: {
      smallHeading: { type: String, trim: true, default: "" },
      heading: { type: String, trim: true, default: "" },
      description: { type: String, default: "" },
      additionalDescription: { type: String, default: "" },
      thumbnail: { type: String, trim: true, default: "" },
      highlights: [{ type: String, trim: true }],
    },
    developer: {
      heading: { type: String, trim: true, default: "" },
      name: { type: String, trim: true, default: "" },
      description: { type: String, default: "" },
      image: { type: String, trim: true, default: "" },
      yearsExperience: { type: String, trim: true, default: "" },
      totalProjects: { type: String, trim: true, default: "" },
      ongoingProjects: { type: String, trim: true, default: "" },
      completedProjects: { type: String, trim: true, default: "" },
      statistics: [statisticSchema],
    },
    amenities: [amenitySchema],
    floorPlans: [floorPlanSchema],
    gallery: [imageSchema],
    galleryLayout: {
      type: String,
      enum: ["masonry", "grid"],
      default: "masonry",
    },
    projectLocation: {
      address: { type: String, trim: true, default: "" },
      mapEmbedUrl: { type: String, trim: true, default: "" },
      latitude: { type: Number },
      longitude: { type: Number },
      nearbyLandmarks: [{ type: String, trim: true }],
      description: { type: String, default: "" },
    },
    sectionContent: {
      amenities: {
        smallHeading: { type: String, trim: true, default: "" },
        heading: { type: String, trim: true, default: "" },
        description: { type: String, default: "" },
      },
      floorPlans: {
        smallHeading: { type: String, trim: true, default: "" },
        heading: { type: String, trim: true, default: "" },
        description: { type: String, default: "" },
      },
      gallery: {
        smallHeading: { type: String, trim: true, default: "" },
        heading: { type: String, trim: true, default: "" },
        description: { type: String, default: "" },
      },
      location: {
        smallHeading: { type: String, trim: true, default: "" },
        heading: { type: String, trim: true, default: "" },
        description: { type: String, default: "" },
      },
    },
    finalCta: {
      heading: { type: String, trim: true, default: "" },
      description: { type: String, default: "" },
      buttonText: { type: String, trim: true, default: "" },
      buttonLink: { type: String, trim: true, default: "" },
      backgroundImage: { type: String, trim: true, default: "" },
      supportingImage: { type: String, trim: true, default: "" },
    },
    seo: {
      metaTitle: { type: String, trim: true, default: "" },
      metaDescription: { type: String, trim: true, default: "" },
      metaKeywords: { type: String, trim: true, default: "" },
      canonicalUrl: { type: String, trim: true, default: "" },
      ogTitle: { type: String, trim: true, default: "" },
      ogDescription: { type: String, trim: true, default: "" },
      ogImage: { type: String, trim: true, default: "" },
      imageAltText: { type: String, trim: true, default: "" },
    },
  },
  { timestamps: true, minimize: false },
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
