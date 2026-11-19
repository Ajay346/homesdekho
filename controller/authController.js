import User from "./../models/userModel.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "./../utils/error.js";
import JWT from "jsonwebtoken";

const getCookieOptions = (req) => {
  const secure = req.secure || process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    sameSite: secure ? "none" : "lax",
    secure,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
};

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashPassword = await bcryptjs.hashSync(password, 10);

  const newUser = new User({ username, email, password: hashPassword });
  try {
    await newUser.save();
    res.status(201).json("User created successfully");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found!"));

    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) return next(errorHandler(401, "Invalid Password!"));

    const token = JWT.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, getCookieOptions(req))
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// Sign Out

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token", getCookieOptions(req));
    res.status(200).json("User has been logged out!");
  } catch (error) {
    next(error);
  }
};
