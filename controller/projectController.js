import slugify from "slugify";
import Project from "../models/projectModel.js";
import Listing from "../models/listingModel.js";
import { errorHandler } from "../utils/error.js";

const normalizeProject = (body) => {
  const project = { ...body };
  delete project._id;
  delete project.__v;
  delete project.createdAt;
  delete project.updatedAt;
  project.name = typeof project.name === "string" ? project.name.trim() : "";
  project.slug =
    typeof project.slug === "string" && project.slug.trim()
      ? slugify(project.slug, { lower: true, strict: true })
      : slugify(project.name, { lower: true, strict: true });

  if (!project.name || !project.slug) {
    throw errorHandler(400, "Project name and a valid slug are required.");
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug)) {
    throw errorHandler(400, "Project slug may contain only letters, numbers, and hyphens.");
  }

  return project;
};

const handleDuplicateSlug = (error, next) => {
  if (error.code === 11000) {
    return next(errorHandler(409, "A project with this slug already exists."));
  }
  if (error.name === "ValidationError") {
    return next(errorHandler(400, error.message));
  }
  return next(error);
};

const listingToProject = (listing) => {
  const imageUrls = Array.isArray(listing.imageUrls) ? listing.imageUrls : [];
  const configurations = Array.isArray(listing.BHK) ? listing.BHK : [];
  const amenities = Array.isArray(listing.amenities) ? listing.amenities : [];

  return {
    name: listing.name,
    slug: listing.slug,
    location: listing.address || listing.subregion || listing.region || "",
    possessionDate: listing.possessiondate || "",
    reraNumber: listing.reraName || "",
    developerName: listing.devlopername || "",
    description: listing.description || "",
    shortDescription: listing.description || "",
    isFeatured: Boolean(listing.discountedDeal),
    isActive: true,
    published: true,
    hero: {
      image: imageUrls[0] || "",
      heading: listing.name || "",
      description: listing.description || "",
      projectName: listing.name || "",
      location: listing.address || listing.subregion || "",
      configurations,
      priceInfo: listing.price || "",
      ctaText: "Enquire Now",
    },
    statistics: listing.possessiondate
      ? [{ label: "Expected possession", value: listing.possessiondate }]
      : [],
    about: {
      smallHeading: "The Project",
      heading: listing.name ? `About ${listing.name}` : "",
      description: listing.description || "",
      thumbnail: imageUrls[0] || "",
      highlights: [],
    },
    developer: {
      name: listing.devlopername || "",
      description: listing.aboutdevloper || "",
    },
    amenities: amenities.map((name, order) => ({
      name: typeof name === "string" ? name : name.name || "",
      description: "",
      icon: "",
      order,
    })),
    floorPlans: configurations.map((title, order) => ({
      title,
      image: "",
      carpetArea: [listing.sqftMin?.[order], listing.sqftMax?.[order]]
        .filter(Boolean)
        .join(" - "),
      price: listing.priceRange?.[order] || "",
      order,
    })),
    gallery: imageUrls.map((url, order) => ({
      url,
      title: "",
      alt: listing.name || "",
      order,
    })),
    projectLocation: {
      address: listing.address || "",
      nearbyLandmarks: [],
    },
  };
};

export const createProject = async (req, res, next) => {
  try {
    const project = await Project.create(normalizeProject(req.body));
    return res.status(201).json(project);
  } catch (error) {
    return handleDuplicateSlug(error, next);
  }
};

export const getProjects = async (req, res, next) => {
  try {
    const { search = "", status = "" } = req.query;
    const filter = {};
    if (status === "published") filter.published = true;
    if (status === "draft") filter.published = false;
    if (status === "active") filter.isActive = true;
    if (status === "inactive") filter.isActive = false;
    if (search.trim()) {
      const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { name: { $regex: escapedSearch, $options: "i" } },
        { slug: { $regex: escapedSearch, $options: "i" } },
        { developerName: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    const projects = await Project.find(filter).sort({ updatedAt: -1 }).lean();
    return res.status(200).json(projects);
  } catch (error) {
    return next(error);
  }
};

export const getLegacyListings = async (req, res, next) => {
  try {
    const projectSlugs = await Project.distinct("slug");
    const filter = { slug: { $nin: projectSlugs } };
    if (typeof req.query.search === "string" && req.query.search.trim()) {
      const escapedSearch = req.query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.name = { $regex: escapedSearch, $options: "i" };
    }
    const listings = await Listing.find(filter)
      .select("name slug address devlopername location updatedAt")
      .sort({ updatedAt: -1 })
      .limit(50)
      .lean();
    return res.status(200).json(listings);
  } catch (error) {
    return next(error);
  }
};

export const importLegacyListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id).lean();
    if (!listing) return next(errorHandler(404, "Existing listing not found."));
    if (await Project.exists({ slug: listing.slug })) {
      return next(errorHandler(409, "A project with this slug already exists."));
    }
    const project = await Project.create(listingToProject(listing));
    await Listing.findByIdAndUpdate(listing._id, { projectPageManaged: true });
    return res.status(201).json(project);
  } catch (error) {
    return handleDuplicateSlug(error, next);
  }
};

export const getProjectBySlug = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      slug: req.params.slug,
      published: true,
      isActive: true,
    }).lean();
    if (project) return res.status(200).json(project);

    const legacyListing = await Listing.findOne({
      slug: req.params.slug,
      propertytype: { $ne: "commercial" },
      projectPageManaged: { $ne: true },
    }).lean();
    if (!legacyListing) return next(errorHandler(404, "Project not found."));
    return res.status(200).json(listingToProject(legacyListing));
  } catch (error) {
    return next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).lean();
    if (!project) return next(errorHandler(404, "Project not found."));
    return res.status(200).json(project);
  } catch (error) {
    return next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const updates = normalizeProject(req.body);
    const project = await Project.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!project) return next(errorHandler(404, "Project not found."));
    return res.status(200).json(project);
  } catch (error) {
    return handleDuplicateSlug(error, next);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return next(errorHandler(404, "Project not found."));
    return res.status(200).json({ message: "Project deleted." });
  } catch (error) {
    return next(error);
  }
};
