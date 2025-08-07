import User from "../models/userModel.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import Listing from "../models/listingModel.js";

export const test = (req, res) => {
  res.json({
    message: "Api Testing",
  });
};

// Fetch user Info

export const fecthPassword = async (req, res, next) => {
  try {
    const userInfo = await User.find().sort({ createdAt: -1 });

    if (!userInfo) {
      return next(errorHandler(404, "Data Not Found"));
    }
    res.status(200).json(userInfo);
  } catch (error) {
    next(error);
  }
};

// Update Password

export const updatePassword = async (req, res, next) => {
  console.log(req.body.email, req.body.newPassword);
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(404, "User not found"));

    const salt = bcryptjs.genSaltSync(10);
    const hashedPassword = bcryptjs.hashSync(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};

// Update User Info

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(403, "You can only update your own account"));

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          password: req.body.password,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// Delete USer Info

export const deleteUSer = async (req, res, next) => {
  // if (req.body._id !== req.params.id)
  //   return next(errorHandler(401, "You can only delete your account"));
  try {
    const findUser = await User.findById(req.params.id);
    if (!findUser) {
      next(errorHandler(401, "User Not Found!"));
    } else {
      await User.findByIdAndDelete(req.params.id);
      res.clearCookie("access_token");
      res.status(200).json("User has been deleted!");
    }
  } catch (error) {
    next(error);
  }
};

// get All Properties

// export const getAllProperties = async (req, res, next) => {
//   try {
//     const listings = await Listing.find({ userRef: req.params.id }).sort({
//       createdAt: -1,
//     });
//     if (!listings) {
//       res.status(202).json("No properties added by you.");
//     } else {
//       res.status(200).json(listings);
//     }
//   } catch (error) {
//     next(error);
//   }
// };

export const getAllProperties = async (req, res, next) => {
  try {
    let listings;
    if (req.params.id === "672873216d6bedd7141bf7a2") {
      // Fetch all properties
      listings = await Listing.find().sort({ createdAt: -1 });
    } else {
      // Fetch properties for the specific user
      listings = await Listing.find({ userRef: req.params.id }).sort({
        createdAt: -1,
      });
    }

    if (!listings || listings.length === 0) {
      res.status(202).json("No properties added by you.");
    } else {
      res.status(200).json(listings);
    }
  } catch (error) {
    next(error);
  }
};
