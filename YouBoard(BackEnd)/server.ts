import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import userRouter from "./src/router/userRouter";
import adminRouter from "./src/router/adminRouter";
import connectDB from "./src/config/mongoDB";
import cookieParser from "cookie-parser";
import { connectRedis } from "./src/services/redis";

const app = express();
const PORT = process.env.PORT;

// connect to mongo database
connectDB();

// connect to redis database
connectRedis();

// for parse incoming json request bodies
app.use(express.json());

// to parse cookies attached to the client request
app.use(cookieParser());

// allow specific origin
app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// mounting route handlers
app.use("/api", userRouter);
app.use("/api/admin", adminRouter);

// listen for connection
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
