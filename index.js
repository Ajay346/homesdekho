import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/userRoute.js";
import authRouter from "./routes/authRoute.js";
import listingRouter from "./routes/listingRouter.js";
import leadRouter from "./routes/leadRouter.js";
import emailRouter from "./routes/emailRouter.js";
import cors from "cors";
import cookieParser from "cookie-parser";
// import path from "path";

dotenv.config();

mongoose
  .connect(process.env.MONGOURL)
  .then(() => {
    console.log("Data Base Connected");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

// const _dirname = path.dirname("");
// const buildpath = path.join(_dirname, "./client/build");
// app.use(express.static(buildpath));

// Cors Error Resolve
app.use(cors());

app.use(express.json());

app.use(cookieParser());

app.listen(5000, () => {
  console.log("Server Is Running!");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);
app.use("/api/emailsend", emailRouter);
app.use("/api/leaddata", leadRouter);
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
