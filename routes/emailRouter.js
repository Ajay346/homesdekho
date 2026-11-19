import express from "express";
import {
  emailGenerator,
  emailsingleGenerator,
} from "../controller/emailController.js";

const router = express.Router();

router.post("/send-email", emailGenerator);
router.post("/send-single-seo-email", emailsingleGenerator);

export default router;
