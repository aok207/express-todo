import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// setup express app

const PORT: number = parseInt(process.env.PORT || "3000");
const app = express();

app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server listening in port ${PORT}...`);
});
