import express from "express";
import { emailGenerator } from "../controller/emailController.js";

const router = express.Router();

router.post("/send-email", emailGenerator);

export default router;
