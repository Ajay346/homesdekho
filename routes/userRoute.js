import express from "express";
import {
  deleteUSer,
  test,
  updateUser,
  getAllProperties,
} from "../controller/userController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);

router.post("/update/:id", verifyToken, updateUser);

router.delete("/delete/:id", deleteUSer);

router.get("/properties/:id", getAllProperties);

export default router;
