import express from "express";
import {
  deleteUSer,
  test,
  updateUser,
  getAllProperties,
  fecthPassword,
  updatePassword,
} from "../controller/userController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);

router.post("/update/:id", verifyToken, updateUser);
router.post("/forgot", fecthPassword);
router.post("/updatepassword", updatePassword);

router.delete("/delete/:id", deleteUSer);

router.get("/properties/:id", getAllProperties);

export default router;
