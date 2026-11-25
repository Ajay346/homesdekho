import { errorHandler } from "./error.js";
import JWT from "jsonwebtoken";
import User from "../models/userModel.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies?.access_token;

  if (!token) return next(errorHandler(401, "Unauthorized"));

  JWT.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, "Forbidden access"));

    req.user = user;
    next();
  });
};

export const verifyAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("role");
    if (!user || user.role !== "Admin") {
      return next(errorHandler(403, "Forbidden"));
    }
    return next();
  } catch (error) {
    return next(error);
  }
};
