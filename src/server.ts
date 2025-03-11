import "reflect-metadata";
import "./_helpers/db"; 
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { AppDataSource } from "./_helpers/db";
import { errorHandler } from "./_middleware/error-handler";
import userRouter from "./users/users.controller"
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize TypeORM DataSource
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/users",userRouter)

// Example route (for testing)
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// ⬇️ Make sure errorHandler is the LAST middleware
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
