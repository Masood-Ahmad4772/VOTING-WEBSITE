import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./utils/db.js";

import cookieParser from "cookie-parser";

const app = express();

dotenv.config();

//Middlewares
app.use(express.json({ limit: "50mb" })); // Increase payload size
app.use(express.urlencoded({ extended: true, limit: "50mb" }));  //using for getting database in json 
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

//routes imported
import userRoutes from "./routes/user.routes.js";
import candidateRoutes from "./routes/candidate.routes.js";
app.use("/user", userRoutes);
app.use("/candidate", candidateRoutes);

app.use("/", (req, res) => {
  res.send("start a voting app");
});

const PORT = process.env.PORT ;

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port http://localhost:${PORT}`);
});
