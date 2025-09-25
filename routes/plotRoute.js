import express from "express";

import { getSearchPlot } from "../controller/plotController.js";

const router = express.Router();

router.post("/search", getSearchPlot);

export default router;
