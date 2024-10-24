import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler, notFound } from "./middlewares/errorMiddleware";
import userRouter from "./routes/userRoutes";
import connectToDB from "./db/connect";
import cookieParser from "cookie-parser";

dotenv.config();

// connnect to db
connectToDB();

// setup express app
const PORT: number = parseInt(process.env.PORT || "3000");
const app = express();

// setup middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// routes
app.use("/api/v1/user", userRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening in port ${PORT}...`);
});
